'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Edit, RefreshCw, Check, Star } from 'lucide-react';

const ReviewSupportApp = () => {
  const [step, setStep] = useState(1);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [treatmentRatings, setTreatmentRatings] = useState({});
  const [staffRatings, setStaffRatings] = useState({});
  const [facilityRatings, setFacilityRatings] = useState({});
  const [bookingInfo, setBookingInfo] = useState({});
  const [treatmentDetails, setTreatmentDetails] = useState([]);
  const [staffDetails, setStaffDetails] = useState([]);
  const [facilityDetails, setFacilityDetails] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [generatedReview, setGeneratedReview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState('');
  
  // 分岐用の状態
  const [selectedChildTreatment, setSelectedChildTreatment] = useState('');
  const [implantCount, setImplantCount] = useState('');
  const [webBookingUsability, setWebBookingUsability] = useState('');

  // Step1の診療内容（順序変更・追加）
  const treatments = [
    { id: 'cavity', label: '虫歯治療' },
    { id: 'root_canal', label: '根管治療' },
    { id: 'periodontal', label: '歯周病治療' },
    { id: 'cleaning', label: 'クリーニング・予防歯科' },
    { id: 'ceramic', label: 'セラミック治療' },
    { id: 'pediatric', label: '小児歯科' },
    { id: 'orthodontics', label: '矯正歯科' },
    { id: 'implant', label: 'インプラント' },
    { id: 'whitening', label: 'ホワイトニング' },
    { id: 'denture', label: '入れ歯' },
    { id: 'tmj', label: 'かみ合わせ・顎関節症' },
    { id: 'wisdom_tooth', label: '親知らずの抜歯' },
    { id: 'other', label: 'その他' }
  ];

  // 小児歯科の分岐
  const pediatricOptions = [
    { id: 'pediatric_cavity', label: 'むし歯' },
    { id: 'pediatric_prevention', label: '予防' },
    { id: 'pediatric_ortho', label: '小児矯正' }
  ];

  // 小児矯正の分岐
  const pediatricOrthoOptions = [
    { id: 'pediatric_ortho_wire', label: 'ワイヤー矯正' },
    { id: 'pediatric_ortho_inside', label: '裏側矯正' },
    { id: 'pediatric_ortho_mouthpiece', label: 'マウスピース矯正' }
  ];

  // 矯正歯科の分岐
  const orthodonticsOptions = [
    { id: 'ortho_wire', label: 'ワイヤー矯正' },
    { id: 'ortho_inside', label: '裏側矯正' },
    { id: 'ortho_mouthpiece', label: 'マウスピース矯正' }
  ];

  // ホワイトニングの分岐
  const whiteningOptions = [
    { id: 'whitening_home', label: '自宅で' },
    { id: 'whitening_clinic', label: '歯医者で' }
  ];

  // インプラント本数
  const implantCounts = [
    { id: '1', label: '1本' },
    { id: '2', label: '2本' },
    { id: '3', label: '3本' },
    { id: '4', label: '4本' },
    { id: '5plus', label: '5本以上' }
  ];

  const treatmentItems = [
    { id: 'explanation', label: '治療内容の説明のわかりやすさ' },
    { id: 'paincare', label: '痛みへの配慮' },
    { id: 'thoroughness', label: '治療の丁寧さ' },
    { id: 'result', label: '治療結果への満足度' }
  ];

  const treatmentDetailOptions = [
    '納得するまで説明してくれた',
    '痛みをほとんど感じなかった',
    '無理に治療を勧めない',
    '治療の選択肢を示してくれた',
    '不安な点を丁寧に解消してくれた',
    '治療計画を明確に示してくれた'
  ];

  // Step4のスタッフ項目変更
  const staffItems = [
    { id: 'treating_staff', label: '治療を担当したスタッフの対応' },
    { id: 'reception', label: '受付の対応' }
  ];

  const staffDetailOptions = [
    '親身に話を聞いてくれた',
    '質問しやすい雰囲気だった',
    '子どもへの対応が優しかった',
    '不安を和らげてくれた',
    '受付の対応が迅速で丁寧',
    'スタッフ全員が笑顔で対応'
  ];

  const facilityItems = [
    { id: 'cleanliness', label: '院内の清潔さ' },
    { id: 'equipment', label: '設備の充実度' },
    { id: 'atmosphere', label: '院内の雰囲気' },
    { id: 'comfort', label: '待合室の快適さ' }
  ];

  const facilityDetailOptions = [
    '最新の設備が整っている',
    '個室診療で安心できた',
    '落ち着いた雰囲気',
    'キッズスペースがある',
    '駐車場が広い',
    'バリアフリーで安心'
  ];

  // Step5の変更
  const bookingOptions = {
    ease: [
      { id: 'easy', label: '希望日時で予約できた' },
      { id: 'moderate', label: '数日待ったが予約できた' },
      { id: 'difficult', label: '予約が取りにくかった' }
    ],
    waitTime: [
      { id: '15min', label: '15分以内' },
      { id: '30min', label: '15〜30分' },
      { id: '60min', label: '30分〜1時間' },
      { id: 'over60', label: '1時間以上' }
    ],
    webBooking: [
      { id: 'yes', label: 'WEB予約があって便利だった' },
      { id: 'no', label: '電話予約のみだった' }
    ],
    webBookingUsability: [
      { id: 'easy', label: '使いやすかった' },
      { id: 'hard', label: '使いづらかった' }
    ]
  };

  const gmbPlaceId = process.env.NEXT_PUBLIC_GMB_PLACE_ID;
  const gmbReviewUrl = gmbPlaceId
    ? `https://search.google.com/local/writereview?placeid=${gmbPlaceId}`
    : 'https://www.google.com/maps/search/?api=1&query=%E3%81%82%E3%81%8A%E3%82%84%E3%81%BE%E6%AD%AF%E7%A7%91%E3%83%BB%E6%AD%A6%E8%94%B5%E5%A2%83';

  const toggleTreatment = (treatmentId) => {
    setSelectedTreatments([treatmentId]);
    
    // 分岐が必要な診療内容の場合、中間ステップを表示
    if (treatmentId === 'pediatric') {
      setStep(1.5); // 小児歯科の分岐
    } else if (treatmentId === 'orthodontics') {
      setStep(1.6); // 矯正歯科の分岐
    } else if (treatmentId === 'implant') {
      setStep(1.7); // インプラント本数選択
    } else if (treatmentId === 'whitening') {
      setStep(1.8); // ホワイトニングの分岐
    } else {
      setStep(2); // 通常はStep2へ
    }
  };

  const handleChildTreatment = (optionId) => {
    setSelectedChildTreatment(optionId);
    setStep(2);
  };

  const handleOrthodontics = (optionId) => {
    setSelectedChildTreatment(optionId);
    setStep(2);
  };

  const handleImplantCount = (countId) => {
    setImplantCount(countId);
    setStep(2);
  };

  const handleWhitening = (optionId) => {
    setSelectedChildTreatment(optionId);
    setStep(2);
  };

  const setRating = (category, item, value) => {
    if (category === 'treatment') {
      setTreatmentRatings(prev => ({ ...prev, [item]: value }));
    } else if (category === 'staff') {
      setStaffRatings(prev => ({ ...prev, [item]: value }));
    } else if (category === 'facility') {
      setFacilityRatings(prev => ({ ...prev, [item]: value }));
    }
  };

  const toggleDetail = (category, option) => {
    if (category === 'treatment') {
      setTreatmentDetails(prev =>
        prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
      );
    } else if (category === 'staff') {
      setStaffDetails(prev =>
        prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
      );
    } else if (category === 'facility') {
      setFacilityDetails(prev =>
        prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
      );
    }
  };

  const setBookingOption = (category, value) => {
    setBookingInfo(prev => ({ ...prev, [category]: value }));
    
    // WEB予約を選んだ場合、使いやすさの選択を表示
    if (category === 'webBooking' && value === 'yes') {
      // Step5の続きで表示される
    }
  };

  const buildPrompt = () => {
    let prompt = '以下の情報をもとに、自然で具体的な歯科医院の口コミレビューを250-350字で作成してください。必ず最後まで完結した文章にしてください。\n\n';

    // 診療内容の構築
    if (selectedTreatments.length > 0) {
      prompt += '【受けた診療】\n';
      const mainTreatment = treatments.find(t => t.id === selectedTreatments[0]);
      if (mainTreatment) {
        prompt += `- ${mainTreatment.label}\n`;
        
        // 分岐内容を追加
        if (selectedTreatments[0] === 'pediatric' && selectedChildTreatment) {
          const pediatricOption = pediatricOptions.find(o => o.id === selectedChildTreatment);
          if (pediatricOption) {
            prompt += `  - ${pediatricOption.label}\n`;
          }
        } else if (selectedTreatments[0] === 'orthodontics' && selectedChildTreatment) {
          const orthoOption = orthodonticsOptions.find(o => o.id === selectedChildTreatment);
          if (orthoOption) {
            prompt += `  - ${orthoOption.label}\n`;
          }
        } else if (selectedTreatments[0] === 'implant' && implantCount) {
          const countOption = implantCounts.find(o => o.id === implantCount);
          if (countOption) {
            prompt += `  - ${countOption.label}\n`;
          }
        } else if (selectedTreatments[0] === 'whitening' && selectedChildTreatment) {
          const whiteningOption = whiteningOptions.find(o => o.id === selectedChildTreatment);
          if (whiteningOption) {
            prompt += `  - ${whiteningOption.label}\n`;
          }
        }
      }
      prompt += '\n';
    }

    const treatmentAvg = Object.values(treatmentRatings).reduce((sum, val) => sum + val, 0) / Object.keys(treatmentRatings).length;
    if (treatmentAvg > 0) {
      prompt += '【治療について】\n';
      treatmentItems.forEach(item => {
        if (treatmentRatings[item.id]) {
          prompt += `- ${item.label}: ${treatmentRatings[item.id]}点\n`;
        }
      });
      if (treatmentDetails.length > 0) {
        prompt += `特に良かった点: ${treatmentDetails.join('、')}\n`;
      }
      prompt += '\n';
    }

    const staffAvg = Object.values(staffRatings).reduce((sum, val) => sum + val, 0) / Object.keys(staffRatings).length;
    if (staffAvg > 0) {
      prompt += '【スタッフの対応】\n';
      staffItems.forEach(item => {
        if (staffRatings[item.id]) {
          prompt += `- ${item.label}: ${staffRatings[item.id]}点\n`;
        }
      });
      if (staffDetails.length > 0) {
        prompt += `特に良かった点: ${staffDetails.join('、')}\n`;
      }
      prompt += '\n';
    }

    const facilityAvg = Object.values(facilityRatings).reduce((sum, val) => sum + val, 0) / Object.keys(facilityRatings).length;
    if (facilityAvg > 0) {
      prompt += '【設備・環境】\n';
      facilityItems.forEach(item => {
        if (facilityRatings[item.id]) {
          prompt += `- ${item.label}: ${facilityRatings[item.id]}点\n`;
        }
      });
      if (facilityDetails.length > 0) {
        prompt += `特に良かった点: ${facilityDetails.join('、')}\n`;
      }
      prompt += '\n';
    }

    if (Object.keys(bookingInfo).length > 0) {
      prompt += '【予約・待ち時間】\n';
      if (bookingInfo.ease) {
        const easeOption = bookingOptions.ease.find(o => o.id === bookingInfo.ease);
        prompt += `- 予約: ${easeOption.label}\n`;
      }
      if (bookingInfo.waitTime) {
        const waitOption = bookingOptions.waitTime.find(o => o.id === bookingInfo.waitTime);
        prompt += `- 待ち時間: ${waitOption.label}\n`;
      }
      if (bookingInfo.webBooking) {
        const webOption = bookingOptions.webBooking.find(o => o.id === bookingInfo.webBooking);
        prompt += `- ${webOption.label}\n`;
        if (bookingInfo.webBooking === 'yes' && webBookingUsability) {
          const usabilityOption = bookingOptions.webBookingUsability.find(o => o.id === webBookingUsability);
          if (usabilityOption) {
            prompt += `  - ${usabilityOption.label}\n`;
          }
        }
      }
      prompt += '\n';
    }

    if (freeText && freeText.trim()) {
      prompt += '【その他の感想・コメント】\n';
      prompt += freeText.trim() + '\n\n';
    }

    prompt += '\n【条件】\n';
    prompt += '- 実際の患者さんが書いたような自然な文体で書いてください\n';
    prompt += '- 具体的で説得力のある内容にしてください\n';
    prompt += '- ポジティブな表現を中心に、不自然な褒め言葉は避けてください\n';
    prompt += '- 「〜だと思います」「〜でした」などの体験談調で書いてください\n';
    prompt += '- 診療内容に言及しながら、全体的な満足度が伝わる口コミにしてください\n';
    prompt += '- 口コミとして投稿できる自然な文章のみを出力してください（前置きや補足説明は不要です）\n';
    prompt += '- 必ず250-350字の範囲で、最後まで完結した文章にしてください\n';
    prompt += '- 文章が途中で切れないように、適切な長さで終了してください';

    return prompt;
  };

  const generateReview = async () => {
    setIsGenerating(true);
    const prompt = buildPrompt();

    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('口コミの生成に失敗しました');

      const data = await response.json();
      setGeneratedReview(data.review);
      setEditedReview(data.review);
      setStep(8);
    } catch (error) {
      console.error('口コミ生成エラー:', error);
      alert('口コミの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedTreatments.length === 0) {
      alert('診療内容を選択してください');
      return;
    }
    if (step === 7) {
      generateReview();
      return;
    }
    if (step === 5 && bookingInfo.webBooking === 'yes' && !webBookingUsability) {
      // WEB予約を選んだ場合、使いやすさの選択が必要
      return;
    }
    setStep(step + 1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('口コミをクリップボードにコピーしました！');
  };

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none transition-transform hover:scale-110">
          <Star size={28} fill={star <= value ? '#fbbf24' : 'none'} stroke={star <= value ? '#fbbf24' : '#d1d5db'} strokeWidth={2} />
        </button>
      ))}
    </div>
  );

  const ProgressBar = () => {
    const totalSteps = 9;
    const currentStep = Math.floor(step);
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>ステップ {currentStep} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">口コミ投稿サポート</h1>
          <p className="text-gray-600 text-center mb-8">いくつかの質問に答えるだけで、素敵な口コミが完成します</p>
          <ProgressBar />

          {/* Step 1: 診療内容選択 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">どの診療を受けましたか？</h2>
              <div className="space-y-3">
                {treatments.map(treatment => (
                  <button
                    key={treatment.id}
                    type="button"
                    onClick={() => toggleTreatment(treatment.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedTreatments.includes(treatment.id)
                        ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                        : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                    }`}
                  >
                    <span className="font-medium">{treatment.label}</span>
                    {selectedTreatments.includes(treatment.id) && <Check className="ml-auto text-white" size={24} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1.5: 小児歯科の分岐 */}
          {step === 1.5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">どの治療を受けましたか？</h2>
              <div className="space-y-3">
                {pediatricOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleChildTreatment(option.id)}
                    className="w-full p-4 rounded-lg border-2 border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500 transition-all text-left"
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1.6: 矯正歯科の分岐 */}
          {step === 1.6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">どの矯正を受けましたか？</h2>
              <div className="space-y-3">
                {orthodonticsOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOrthodontics(option.id)}
                    className="w-full p-4 rounded-lg border-2 border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500 transition-all text-left"
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1.7: インプラント本数選択 */}
          {step === 1.7 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">インプラントは何本ですか？</h2>
              <div className="space-y-3">
                {implantCounts.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleImplantCount(option.id)}
                    className="w-full p-4 rounded-lg border-2 border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500 transition-all text-left"
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1.8: ホワイトニングの分岐 */}
          {step === 1.8 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">ホワイトニングはどこで受けましたか？</h2>
              <div className="space-y-3">
                {whiteningOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleWhitening(option.id)}
                    className="w-full p-4 rounded-lg border-2 border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500 transition-all text-left"
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 治療についての評価（最初から特に良かった点を表示） */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">治療についての評価</h2>
              <div className="space-y-4">
                {treatmentItems.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-3">{item.label}</label>
                    <StarRating value={treatmentRatings[item.id] || 0} onChange={(value) => setRating('treatment', item.id, value)} />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-3">特に良かった点は？（複数選択可）</label>
                <div className="space-y-3">
                  {treatmentDetailOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDetail('treatment', option)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        treatmentDetails.includes(option)
                          ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                          : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            treatmentDetails.includes(option) ? 'bg-white border-white' : 'border-white'
                          }`}
                        >
                          {treatmentDetails.includes(option) && <Check size={16} className="text-sky-600" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: スタッフの対応（変更：治療担当スタッフ、受付） */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">スタッフの対応はどうでしたか？</h2>
              <div className="space-y-4">
                {staffItems.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-3">{item.label}</label>
                    <StarRating value={staffRatings[item.id] || 0} onChange={(value) => setRating('staff', item.id, value)} />
                  </div>
                ))}
              </div>
              {Object.values(staffRatings).some(v => v >= 4) && (
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-3">特に良かった点は？（複数選択可）</label>
                  <div className="space-y-3">
                    {staffDetailOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDetail('staff', option)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          staffDetails.includes(option)
                            ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                            : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              staffDetails.includes(option) ? 'bg-white border-white' : 'border-white'
                            }`}
                          >
                            {staffDetails.includes(option) && <Check size={16} className="text-sky-600" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: 設備・環境 */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">設備・環境はどうでしたか？</h2>
              <div className="space-y-4">
                {facilityItems.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-3">{item.label}</label>
                    <StarRating value={facilityRatings[item.id] || 0} onChange={(value) => setRating('facility', item.id, value)} />
                  </div>
                ))}
              </div>
              {Object.values(facilityRatings).some(v => v >= 4) && (
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-3">特に良かった点は？（複数選択可）</label>
                  <div className="space-y-3">
                    {facilityDetailOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDetail('facility', option)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          facilityDetails.includes(option)
                            ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                            : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              facilityDetails.includes(option) ? 'bg-white border-white' : 'border-white'
                            }`}
                          >
                            {facilityDetails.includes(option) && <Check size={16} className="text-sky-600" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: 予約の取りやすさ */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">予約の取りやすさはどうでしたか？</h2>
              <div className="space-y-3">
                {bookingOptions.ease.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBookingOption('ease', option.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      bookingInfo.ease === option.id
                        ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                        : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          bookingInfo.ease === option.id ? 'bg-white border-white' : 'border-white'
                        }`}
                      >
                        {bookingInfo.ease === option.id && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: 待ち時間とWEB予約 */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">待ち時間はどれくらいでしたか？</h2>
              <div className="space-y-3">
                {bookingOptions.waitTime.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBookingOption('waitTime', option.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      bookingInfo.waitTime === option.id
                        ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                        : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          bookingInfo.waitTime === option.id ? 'bg-white border-white' : 'border-white'
                        }`}
                      >
                        {bookingInfo.waitTime === option.id && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <label className="block text-gray-700 font-medium mb-3">予約方法について</label>
                <div className="space-y-3">
                  {bookingOptions.webBooking.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setBookingOption('webBooking', option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        bookingInfo.webBooking === option.id
                          ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                          : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            bookingInfo.webBooking === option.id ? 'bg-white border-white' : 'border-white'
                          }`}
                        >
                          {bookingInfo.webBooking === option.id && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {bookingInfo.webBooking === 'yes' && (
                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-3">WEB予約の使いやすさはどうでしたか？</label>
                    <div className="space-y-3">
                      {bookingOptions.webBookingUsability.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setWebBookingUsability(option.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            webBookingUsability === option.id
                              ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                              : 'border-sky-200 bg-sky-400 text-white hover:bg-sky-500 hover:border-sky-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                webBookingUsability === option.id ? 'bg-white border-white' : 'border-white'
                              }`}
                            >
                              {webBookingUsability === option.id && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                            </div>
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 7: その他の感想 */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">その他に伝えたいことはありますか？（任意）</h2>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-3">ここまでの質問で伝えきれなかったこと、特に印象に残ったエピソード、先生やスタッフへの感謝の気持ちなど、自由に記入してください。</p>
                <textarea value={freeText} onChange={(e) => setFreeText(e.target.value)}
                  placeholder="例：先生が子どもの不安を和らげるために優しく声をかけてくれて、安心して治療を受けることができました。"
                  className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  maxLength={500} />
                <div className="text-right text-sm text-gray-500 mt-2">{freeText.length} / 500文字</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">💡 この内容は口コミ生成時に反映されます。空欄のまま次へ進むこともできます。</p>
              </div>
            </div>
          )}

          {/* Step 8: 生成された口コミ（再生成をテキストリンクに変更） */}
          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">生成された口コミ</h2>
              {isEditing ? (
                <div>
                  <textarea value={editedReview} onChange={(e) => setEditedReview(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setGeneratedReview(editedReview); setIsEditing(false); }}
                      className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={20} /> 保存
                    </button>
                    <button
                      onClick={() => { setEditedReview(generatedReview); setIsEditing(false); }}
                      className="px-6 bg-sky-400 text-white py-3 rounded-lg font-medium hover:bg-sky-500 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 min-h-[200px]">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{generatedReview}</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={20} /> 編集する
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      onClick={generateReview}
                      disabled={isGenerating}
                      className="text-sm text-gray-600 hover:text-gray-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? '生成中...' : '再生成'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 9: 口コミ投稿（リード文変更、コピーボタンの色変更、クリックでコピー） */}
          {step === 9 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">口コミを投稿しましょう</h2>
              <p className="text-gray-700 mb-4">以下の口コミをコピーして、Googleマップに投稿してください。</p>
              <div 
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => copyToClipboard(generatedReview)}
              >
                <p className="text-gray-700 leading-relaxed">{generatedReview}</p>
                <p className="text-xs text-gray-500 mt-2">※クリックでコピーできます</p>
              </div>
              <div className="space-y-3">
                <a href={gmbReviewUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Google口コミに投稿する</div>
                      <div className="text-sm opacity-90">Googleビジネスプロフィールに投稿</div>
                    </div>
                    <ChevronRight className="text-white opacity-90" />
                  </div>
                </a>
                <button 
                  onClick={() => copyToClipboard(generatedReview)}
                  className="w-full p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
                >
                  📋 口コミをコピー
                </button>
              </div>
              <div className="mt-8 text-center">
                <button onClick={() => { 
                  setStep(1); 
                  setSelectedTreatments([]); 
                  setTreatmentRatings({}); 
                  setStaffRatings({}); 
                  setFacilityRatings({}); 
                  setBookingInfo({}); 
                  setTreatmentDetails([]); 
                  setStaffDetails([]); 
                  setFacilityDetails([]); 
                  setFreeText(''); 
                  setGeneratedReview(''); 
                  setSelectedChildTreatment('');
                  setImplantCount('');
                  setWebBookingUsability('');
                }}
                  className="text-blue-500 hover:text-blue-600 font-medium">
                  最初からやり直す
                </button>
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          {step < 9 && step >= 1 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && step !== 1.5 && step !== 1.6 && step !== 1.7 && step !== 1.8 && (
                <button onClick={() => {
                  if (step === 2) {
                    // Step2から戻る場合、Step1に戻る
                    setStep(1);
                  } else {
                    setStep(step - 1);
                  }
                }} disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-lg font-medium hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft size={20} /> 戻る
                </button>
              )}
              {(step === 1.5 || step === 1.6 || step === 1.7 || step === 1.8) && (
                <button onClick={() => setStep(1)} disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-lg font-medium hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft size={20} /> 戻る
                </button>
              )}
              {step !== 1.5 && step !== 1.6 && step !== 1.7 && step !== 1.8 && (
                <button onClick={handleNext} disabled={isGenerating || (step === 1 && selectedTreatments.length === 0) || (step === 6 && bookingInfo.webBooking === 'yes' && !webBookingUsability)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isGenerating ? (<><RefreshCw size={20} className="animate-spin" /> 生成中...</>) : (<>{step === 7 ? '口コミを生成' : '次へ'} {step < 7 && <ChevronRight size={20} />}</>)}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>このツールは歯科医院の口コミ投稿をサポートします</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSupportApp;
