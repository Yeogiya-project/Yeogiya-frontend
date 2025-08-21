export const CATEGORY_DATA = {
    restaurant: {
        name: '맛집',
        categoryCode: 'FD6',
        subCategories: [
            { id: 'korean', name: '한식', keyword: '한식' },
            { id: 'chinese', name: '중식', keyword: '중식' },
            { id: 'japanese', name: '일식', keyword: '일식' },
            { id: 'western', name: '양식', keyword: '양식' },
            { id: 'asian', name: '아시안', keyword: '아시아음식' },
            { id: 'bunsik', name: '분식', keyword: '분식' },
            { id: 'meat', name: '고기', keyword: '고기' },
            { id: 'sashimi', name: '회', keyword: '회' },
            { id: 'sulzip', name: '술집', keyword: '술집' },
        ],
    },
    cafe: {
        name: '카페',
        categoryCode: 'CE7',
        subCategories: [
            { id: 'starbucks', name: '스타벅스', keyword: '스타벅스' },
            { id: 'twosome', name: '투썸플레이스', keyword: '투썸플레이스' },
            { id: 'mammoth', name: '매머드커피', keyword: '매머드' },
            { id: 'mega', name: '메가커피', keyword: '메가MGC' },
            { id: 'bana', name: '바나프레소', keyword: '바나프레소' },
            { id: 'dessert', name: '디저트', keyword: '디저트카페' },
            { id: 'cafe', name: '모든카페', keyword: '카페' },
            { id: 'thema-cafe', name: '테마카페', keyword: '테마카페' },
            { id: 'study', name: '스터디카페', keyword: '스터디카페' },
        ],
    },
} as const;