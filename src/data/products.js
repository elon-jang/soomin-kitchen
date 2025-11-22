import kimchiImg from '../assets/products/kimchi.png';
import bulgogiImg from '../assets/products/bulgogi-marinade.png';
import redGinsengImg from '../assets/products/red-ginseng.png';
import tteokbokkiImg from '../assets/products/tteokbokki.png';
import seaweedImg from '../assets/products/seaweed.png';
import gochujangImg from '../assets/products/gochujang.png';
import riceImg from '../assets/products/rice.png';

export const products = [
    {
        id: 1,
        name: {
            ko: "프리미엄 김치 세트",
            en: "Premium Kimchi Set"
        },
        price: 35000,
        category: {
            ko: "김치",
            en: "Kimchi"
        },
        image: kimchiImg,
        description: {
            ko: "프리미엄 한국산 재료로 만든 전통 수제 김치입니다. 완벽하게 숙성되었습니다.",
            en: "Traditional handmade Kimchi made with premium Korean ingredients. Fermented to perfection."
        },
        isNew: true
    },
    {
        id: 2,
        name: {
            ko: "불고기 양념 키트",
            en: "Bulgogi Marinade Kit"
        },
        price: 28000,
        category: {
            ko: "밀키트",
            en: "Meal Kit"
        },
        image: bulgogiImg,
        description: {
            ko: "미리 손질된 프리미엄 소고기와 정통 불고기 양념이 포함되어 있습니다. 몇 분 안에 요리할 수 있습니다.",
            en: "Authentic Bulgogi marinade with pre-sliced premium beef. Ready to cook in minutes."
        },
        isNew: false
    },
    {
        id: 3,
        name: {
            ko: "비빔밥 에센셜",
            en: "Bibimbap Essentials"
        },
        price: 15000,
        category: {
            ko: "밀키트",
            en: "Meal Kit"
        },
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
        description: {
            ko: "완벽한 비빔밥을 위한 모든 채소와 소스가 포함되어 있습니다. 밥만 추가하세요.",
            en: "All the vegetables and sauces you need for a perfect Bibimbap. Just add rice."
        },
        isNew: false
    },
    {
        id: 4,
        name: {
            ko: "한국 홍삼 엑기스",
            en: "Korean Red Ginseng Extract"
        },
        price: 120000,
        category: {
            ko: "건강식품",
            en: "Health"
        },
        image: redGinsengImg,
        description: {
            ko: "면역력과 에너지 증진을 위한 6년근 한국 홍삼 엑기스입니다.",
            en: "6-year-old Korean Red Ginseng extract for boosting immunity and energy."
        },
        isNew: true
    },
    {
        id: 5,
        name: {
            ko: "매운 떡볶이 팩",
            en: "Spicy Tteokbokki Pack"
        },
        price: 12000,
        category: {
            ko: "과자",
            en: "Snack"
        },
        image: tteokbokkiImg,
        description: {
            ko: "비밀 매운 소스와 함께 제공되는 쫄깃한 떡입니다. 집에서 즐기는 길거리 음식입니다.",
            en: "Chewy rice cakes with our secret spicy sauce. A street food favorite at home."
        },
        isNew: false
    },
    {
        id: 6,
        name: {
            ko: "유기농 구운 김",
            en: "Organic Roasted Seaweed"
        },
        price: 8000,
        category: {
            ko: "반찬",
            en: "Side Dish"
        },
        image: seaweedImg,
        description: {
            ko: "바삭하고 고소한 구운 김입니다. 밥과 함께 먹거나 건강한 간식으로 완벽합니다.",
            en: "Crispy and savory roasted seaweed. Perfect with rice or as a healthy snack."
        },
        isNew: false
    },
    {
        id: 7,
        name: {
            ko: "전통 고추장",
            en: "Traditional Gochujang"
        },
        price: 18000,
        category: {
            ko: "양념",
            en: "Sauce"
        },
        image: gochujangImg,
        description: {
            ko: "깊은 감칠맛과 매콤한 발효 고추장입니다. 한국 요리에 필수적입니다.",
            en: "Deeply savory and spicy fermented chili paste. Essential for Korean cooking."
        },
        isNew: false
    },
    {
        id: 8,
        name: {
            ko: "프리미엄 단립쌀",
            en: "Premium Short Grain Rice"
        },
        price: 42000,
        category: {
            ko: "곡물",
            en: "Grains"
        },
        image: riceImg,
        description: {
            ko: "이천에서 온 고품질 단립쌀입니다. 지을 때 찰지고 윤기가 납니다.",
            en: "High-quality short grain rice from Icheon. Sticky and lustrous when cooked."
        },
        isNew: true
    }
];
