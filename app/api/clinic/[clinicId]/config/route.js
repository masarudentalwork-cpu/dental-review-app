// 医院ごとの設定（環境変数またはデータベースから取得）
// 本番環境ではデータベースから取得することを推奨

const clinicConfigs = {
  // デフォルト（環境変数から取得）
  default: {
    placeId: process.env.NEXT_PUBLIC_GMB_PLACE_ID || '',
    name: '歯科医院',
  },
  // 医院ごとの設定（環境変数から取得、またはハードコード）
  'aoyama-dental': {
    placeId: process.env.NEXT_PUBLIC_AOYAMA_PLACE_ID || process.env.NEXT_PUBLIC_GMB_PLACE_ID || '',
    name: 'あおやま歯科・武蔵境',
  },
  // 他の医院を追加する場合は、以下の形式で追加してください
  // '医院ID（英数字、ハイフン可）': {
  //   placeId: process.env.NEXT_PUBLIC_[医院IDを大文字にした変数名]_PLACE_ID || '',
  //   name: '医院名',
  // },
  // 例：
  // 'clinic-b': {
  //   placeId: process.env.NEXT_PUBLIC_CLINIC_B_PLACE_ID || '',
  //   name: '医院B',
  // },
  // 'takahashi-dental': {
  //   placeId: process.env.NEXT_PUBLIC_TAKAHASHI_DENTAL_PLACE_ID || '',
  //   name: '高橋歯科医院',
  // },
};

export async function GET(request, { params }) {
  try {
    const { clinicId } = await params;

    // 医院設定を取得
    const config = clinicConfigs[clinicId] || clinicConfigs.default;

    if (!config.placeId) {
      return Response.json(
        { error: '医院のPlace IDが設定されていません' },
        { status: 404 }
      );
    }

    // Google MapsレビューURLを生成
    const gmbReviewUrl = `https://search.google.com/local/writereview?placeid=${config.placeId}`;

    return Response.json({
      clinicId,
      name: config.name,
      placeId: config.placeId,
      gmbReviewUrl,
    });
  } catch (error) {
    console.error('Clinic config error:', error);
    return Response.json(
      { error: '医院設定の取得に失敗しました' },
      { status: 500 }
    );
  }
}
