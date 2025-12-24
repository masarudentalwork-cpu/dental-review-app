export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'Google APIキーが設定されていません' },
        { status: 500 }
      );
    }

    if (!prompt) {
      return Response.json(
        { error: 'promptが必要です' },
        { status: 400 }
      );
    }

    console.log('=== Gemini 2.5 Flash API呼び出し開始 ===');

    // 正しいモデル名: gemini-2.5-flash
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
          }
        })
      }
    );

    console.log('Gemini APIレスポンス:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return Response.json(
        { error: 'Gemini APIエラー', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Geminiのレスポンス構造から口コミテキストを取得
    const reviewText = data.candidates[0].content.parts[0].text;

    console.log('生成成功:', reviewText.substring(0, 50) + '...');

    return Response.json({ review: reviewText });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json(
      { error: '口コミの生成に失敗しました', details: error.message },
      { status: 500 }
    );
  }
}
