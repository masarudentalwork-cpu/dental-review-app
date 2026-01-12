// レート制限用のMap（本番環境ではRedisなどを使うことを推奨）
const rateLimitMap = new Map();

// レート制限の設定
const RATE_LIMIT = {
  maxRequests: 10, // 1時間あたりの最大リクエスト数
  windowMs: 60 * 60 * 1000, // 1時間（ミリ秒）
};

// IPアドレスからレート制限をチェック
function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };

  // 時間窓がリセットされた場合
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT.windowMs;
  }

  // リクエスト数が上限を超えている場合
  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  // リクエスト数を増やす
  userLimit.count++;
  rateLimitMap.set(ip, userLimit);

  return true;
}

// 入力検証
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'promptは文字列である必要があります' };
  }

  // 長さチェック（最大5000文字）
  if (prompt.length > 5000) {
    return { valid: false, error: 'promptが長すぎます（最大5000文字）' };
  }

  // 最小長チェック
  if (prompt.length < 10) {
    return { valid: false, error: 'promptが短すぎます（最小10文字）' };
  }

  // 危険な文字列のチェック（基本的なインジェクション対策）
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\(/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, error: '無効な文字列が含まれています' };
    }
  }

  return { valid: true };
}

// エラーメッセージのサニタイズ（詳細情報を隠す）
function sanitizeError(error, isProduction = process.env.NODE_ENV === 'production') {
  if (isProduction) {
    // 本番環境では詳細なエラー情報を返さない
    return {
      error: '口コミの生成に失敗しました。しばらく時間をおいて再度お試しください。',
    };
  }
  // 開発環境では詳細情報を返す
  return {
    error: '口コミの生成に失敗しました',
    details: error.message,
  };
}

export async function POST(request) {
  try {
    // CORS設定
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'https://localhost:3000',
    ].filter(Boolean);

    // リクエストサイズの制限（10KB）
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024) {
      return Response.json(
        { error: 'リクエストサイズが大きすぎます' },
        { status: 413 }
      );
    }

    // レート制限チェック
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'リクエストが多すぎます。しばらく時間をおいて再度お試しください。' },
        { status: 429 }
      );
    }

    // リクエストボディの取得
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json(
        { error: '無効なJSON形式です' },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // APIキーの確認
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('Google APIキーが設定されていません');
      return Response.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      );
    }

    // 入力検証
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Gemini API呼び出し
    console.log('=== Gemini 2.5 Flash API呼び出し開始 ===');
    console.log(`IP: ${ip}, Prompt length: ${prompt.length}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
        // タイムアウト設定（25秒 - Vercelの無料プランは10秒だが、Hobbyプランは60秒）
        signal: AbortSignal.timeout(25000)
      }
    );

    console.log('Gemini APIレスポンス:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error' };
      }

      console.error('Gemini API Error:', errorData);

      // エラーの種類に応じて適切なレスポンスを返す
      if (response.status === 429) {
        return Response.json(
          { error: 'APIの利用制限に達しました。しばらく時間をおいて再度お試しください。' },
          { status: 429 }
        );
      }

      if (response.status === 401 || response.status === 403) {
        console.error('API認証エラー - APIキーを確認してください');
        return Response.json(
          { error: '認証エラーが発生しました' },
          { status: 500 }
        );
      }

      // その他のエラー
      const sanitizedError = sanitizeError(
        new Error(errorData.message || 'API呼び出しエラー'),
        true
      );
      return Response.json(
        sanitizedError,
        { status: response.status >= 500 ? 500 : response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('JSON解析エラー:', error);
      return Response.json(
        { error: 'APIからの応答の解析に失敗しました' },
        { status: 500 }
      );
    }
    
    // レスポンスの検証
    if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('無効なAPIレスポンス構造:', JSON.stringify(data, null, 2));
      return Response.json(
        { error: 'APIからの応答が無効です' },
        { status: 500 }
      );
    }

    const candidate = data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
      console.error('無効なcandidate構造:', JSON.stringify(candidate, null, 2));
      return Response.json(
        { error: 'APIからの応答が無効です' },
        { status: 500 }
      );
    }

    // 安全性チェック（ブロックされた場合）
    if (candidate.finishReason === 'SAFETY') {
      console.error('安全性フィルターによりブロックされました');
      return Response.json(
        { error: '生成された内容が安全性フィルターによりブロックされました。別の内容でお試しください。' },
        { status: 400 }
      );
    }

    // Geminiのレスポンス構造から口コミテキストを取得
    const reviewText = candidate.content.parts[0]?.text;

    // 出力の検証
    if (!reviewText || typeof reviewText !== 'string') {
      console.error('無効なレビューテキスト:', reviewText);
      console.error('レスポンス全体:', JSON.stringify(data, null, 2));
      return Response.json(
        { error: '口コミの生成に失敗しました' },
        { status: 500 }
      );
    }

    // 出力の長さチェック（最大5000文字）
    const sanitizedReview = reviewText.length > 5000 
      ? reviewText.substring(0, 5000) 
      : reviewText;

    console.log('生成成功:', sanitizedReview.substring(0, 50) + '...');

    // CORSヘッダーを設定
    const headers = {
      'Content-Type': 'application/json',
    };

    if (origin && allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'POST';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    return Response.json(
      { review: sanitizedReview },
      { headers }
    );

  } catch (error) {
    // タイムアウトエラーの処理
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      console.error('API呼び出しタイムアウト:', error);
      return Response.json(
        { error: 'リクエストがタイムアウトしました。しばらく時間をおいて再度お試しください。' },
        { status: 504 }
      );
    }

    // 詳細なエラーログ（本番環境でも記録）
    console.error('Server Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // 開発環境では詳細なエラーを返す
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
      return Response.json(
        { 
          error: '口コミの生成に失敗しました',
          details: error.message,
          stack: error.stack
        },
        { status: 500 }
      );
    }
    
    // 本番環境では汎用的なエラーメッセージ
    return Response.json(
      { error: '口コミの生成に失敗しました。しばらく時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}

// OPTIONSリクエストの処理（CORS preflight）
export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean);

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, { headers });
}
