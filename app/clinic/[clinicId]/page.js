import ReviewSupportApp from '../../../components/ReviewSupportApp';

export async function generateMetadata({ params }) {
  const { clinicId } = await params;
  
  // 医院設定を取得（SSRで取得する場合）
  // ここでは動的に設定するか、デフォルト値を使用
  return {
    title: '口コミ投稿サポート | 歯科医院向け',
    description: 'いくつかの質問に答えるだけで、素敵な口コミが完成します',
  };
}

export default async function ClinicPage({ params }) {
  const { clinicId } = await params;
  
  return <ReviewSupportApp clinicId={clinicId} />;
}
