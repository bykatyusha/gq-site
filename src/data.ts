export type Color = { name: string; hex: string; img: string }
export type Product = {
  id: string
  brand: string
  name: string
  price: number
  oldPrice?: number
  badge?: string
  img: string
  colors?: Color[]
  size?: string
}

const p = (o: Product) => o

export const PRODUCTS: Record<string, Product> = Object.fromEntries(
  [
    p({ id: 'ag-velvet-jacket', brand: 'Agnona', name: 'Бархатный жакет с поясом', price: 312000, img: 'p-velvet-jacket' }),
    p({ id: 'ag-velvet-pants', brand: 'Agnona', name: 'Широкие брюки из бархата', price: 168000, img: 'p-velvet-pants' }),
    p({
      id: 'mm-arcadie', brand: 'Miu Miu', name: 'Сумка Arcadie', price: 298000, img: 'p-arcadie-black',
      colors: [
        { name: 'Чёрный', hex: '#1E1E1E', img: 'p-arcadie-black' },
        { name: 'Коричневый', hex: '#7A4426', img: 'p-arcadie-brown' },
      ],
    }),
    p({ id: 'js-shoes', brand: 'Jil Sander', name: 'Туфли из кожи', price: 98500, img: 'p-js-shoes' }),
    p({ id: 'ag-velvet-dress', brand: 'Agnona', name: 'Платье миди из бархата', price: 246000, oldPrice: 308000, badge: 'Скидка −20%', img: 'p-velvet-dress' }),
    p({ id: 'js-jacket', brand: 'Jil Sander', name: 'Жакет из фланели', price: 289000, img: 'p-js-jacket' }),
    p({ id: 'js-pants', brand: 'Jil Sander', name: 'Брюки из фланели', price: 142000, img: 'p-js-pants' }),
    p({ id: 'js-turtleneck', brand: 'Jil Sander', name: 'Водолазка из шерсти и кашемира', price: 72300, img: 'p-js-turtleneck' }),
    p({ id: 'prada-rect', brand: 'Prada', name: 'Прямоугольные очки', price: 42500, img: 'p-prada-rect' }),
    p({ id: 'ag-sweater', brand: 'Agnona', name: 'Свитер из кашемира', price: 156000, img: 'p-ag-sweater' }),
    p({ id: 'ag-pants', brand: 'Agnona', name: 'Брюки из шерсти прямого кроя', price: 98000, img: 'p-ag-pants' }),
    p({ id: 'mm-belt', brand: 'Miu Miu', name: 'Ремень из замши', price: 54000, oldPrice: 72000, badge: 'Скидка −25%', img: 'p-mm-belt' }),
    p({ id: 'prada-round', brand: 'Prada', name: 'Круглые очки Iconic Plaque', price: 46800, img: 'p-prada-round' }),
    p({
      id: 'prada-bonnie', brand: 'Prada', name: 'Сумка Bonnie', price: 365000, img: 'p-bonnie-brown',
      colors: [
        { name: 'Коричневый', hex: '#6A3F25', img: 'p-bonnie-brown' },
        { name: 'Тёмно-зелёный', hex: '#2A2E25', img: 'p-bonnie-green' },
      ],
    }),
    p({ id: 'prada-cartiglio', brand: 'Prada', name: 'Очки Cartiglio в черепаховой оправе', price: 47900, oldPrice: 59900, badge: '−20%', img: 'p-prada-cartiglio' }),
    p({ id: 'prada-clear', brand: 'Prada', name: 'Очки в прозрачной оправе', price: 44200, img: 'p-prada-clear' }),
    p({ id: 'prada-symbole', brand: 'Prada', name: 'Очки Symbole', price: 49300, img: 'p-prada-symbole' }),
    p({ id: 'ag-skirt', brand: 'Agnona', name: 'Юбка миди из шерсти', price: 118000, oldPrice: 168000, badge: 'Скидка −30%', img: 'p-ag-skirt' }),
    p({ id: 'js-sweater', brand: 'Jil Sander', name: 'Свитер из шерсти в рубчик', price: 64500, img: 'p-js-sweater' }),
    p({ id: 'val-jacket', brand: 'Valentino', name: 'Куртка из кожи с поясом', price: 489000, img: 'p-val-jacket' }),
  ].map((x) => [x.id, x]),
)

export type Story = { id: string; kicker: string; title: string; desc: string; img: string; items: string[] }

export const STORIES: Record<string, Story> = {
  coat: {
    id: 'coat', kicker: 'Образ сезона', title: 'Время пальто', img: 'l-js-coat',
    desc: 'Двубортное пальто из серой шерсти Jil Sander и широкие брюки. Силуэт, с которого начинается гардероб на холода.',
    items: ['js-turtleneck', 'js-pants', 'js-shoes', 'ag-sweater'],
  },
  textures: {
    id: 'textures', kicker: 'Образ из слайдера', title: 'Фактуры сезона', img: 'l-ag-blazer',
    desc: 'Бархат Agnona цвета бордо: жакет с поясом и широкие брюки. К ним сумка Miu Miu и чёрные туфли.',
    items: ['ag-velvet-jacket', 'ag-velvet-pants', 'mm-arcadie', 'js-shoes', 'ag-velvet-dress'],
  },
  quiet: {
    id: 'quiet', kicker: 'Образ из истории', title: 'Тихая строгость', img: 'l-js-suit',
    desc: 'Фланель, тонкий трикотаж и юбки миди. Чёрный, графит и серый без единой лишней детали.',
    items: ['js-jacket', 'js-pants', 'js-turtleneck', 'js-shoes'],
  },
  beige: {
    id: 'beige', kicker: 'Образ из слайдера', title: 'Мягкий беж', img: 'l-js-cardigan',
    desc: 'Кашемир и шерсть Agnona, сумка и ремень Miu Miu. Светлый образ на межсезонье.',
    items: ['ag-sweater', 'ag-pants', 'mm-arcadie', 'mm-belt', 'prada-round'],
  },
  leather: {
    id: 'leather', kicker: 'Образ из истории', title: 'Кожа и бархат', img: 'l-val-leather',
    desc: 'Кожаные жакеты Valentino и бархат Agnona. Вечерние фактуры, которые носят днём.',
    items: ['val-jacket', 'ag-velvet-jacket', 'ag-velvet-dress', 'mm-arcadie'],
  },
  office: {
    id: 'office', kicker: 'Образ из истории', title: 'В офис и после', img: 'l-mm-black',
    desc: 'Рубашки и юбки-карандаш Miu Miu днём, маленькое чёрное платье Valentino вечером.',
    items: ['js-turtleneck', 'ag-skirt', 'mm-belt', 'js-shoes'],
  },
  prada: {
    id: 'prada', kicker: 'Аксессуары', title: 'Сумки и очки Prada', img: 'p-bonnie-brown',
    desc: 'Тоуты из гладкой кожи и замши, очки в черепаховой оправе. Аксессуары, на которых держится весь образ.',
    items: ['prada-bonnie', 'prada-round', 'prada-rect', 'prada-cartiglio', 'prada-clear'],
  },
}

export const SLIDES = [
  { story: 'textures', hero: 'h-textures', cta: 'Купить' },
  { story: 'quiet', hero: 'h-slide2', cta: 'Купить', titleOverride: 'Тихая строгость', descOverride: 'Фланелевый костюм, тонкая водолазка и чёрные лодочки. Образ Jil Sander целиком.', items: ['js-jacket', 'js-pants', 'js-turtleneck', 'js-shoes', 'prada-rect'] },
  { story: 'beige', hero: 'h-slide3', cta: 'Купить' },
]

export const LOOKBOOKS = {
  quiet: ['l-js-dress', 'l-js-suit', 'l-js-cardigan', 'l-js-shirt'],
  leather: ['l-val-leather', 'l-ag-blazer', 'l-ag-dress', 'l-val-mini'],
  office: ['l-mm-black', 'l-mm-beige', 'l-mm-mini', 'l-val-black'],
}

export const BRAND_STORIES = [
  { name: 'Jil Sander', logo: 'jil-sander', img: 's-jil-sander', caption: 'Чистые линии и немецкая точность кроя' },
  { name: 'Agnona', logo: 'agnona', img: 's-agnona', caption: 'Итальянский кашемир высшей категории' },
  { name: 'Valentino', logo: 'valentino', img: 's-valentino', caption: 'Римская мастерская и кутюрная кожа' },
  { name: 'Miu Miu', logo: 'miu-miu', img: 's-miu-miu', caption: 'Ироничная женственность и поплин' },
  { name: 'Andre Maurice', logo: 'andre-maurice', img: 's-andre-maurice', caption: 'Итальянский кашемир высшей категории' },
  { name: 'Missoni', logo: 'missoni', img: 's-missoni', caption: 'Зигзаг, люрекс и тонкий трикотаж' },
  { name: 'Haikure', logo: 'haikure', img: 's-haikure', caption: 'Итальянский деним с ручной отделкой' },
  { name: 'Manzoni24', logo: 'manzoni24', img: 's-manzoni24', caption: 'Замша и кожа ручной работы' },
  { name: 'Santoni', logo: 'santoni', img: 's-santoni', caption: 'Обувь из Марке с 1975 года' },
  { name: 'Valextra', logo: '', img: 's-valextra', caption: 'Миланские сумки без логотипов' },
  { name: 'D.Exterior', logo: 'dexterior', img: 's-dexterior', caption: 'Трикотаж с архитектурным кроем' },
  { name: '120% Lino', logo: 'lino', img: 's-lino', caption: 'Лён из Италии во всех оттенках' },
  { name: 'Maurizio', logo: 'maurizio', img: 's-maurizio', caption: 'Шёлк и кашемир для аксессуаров' },
  { name: 'Bacon', logo: 'bacon', img: 's-bacon', caption: 'Пуховики как скульптура' },
]

export type Tile = { img: string; caption: string }
export type Sub = { rows?: string[]; tiles?: Tile[]; look?: { img: string; items: string[]; story: string } }
export type Menu = { key: string; label: string; rows: { label: string; sub?: string; chevron?: boolean }[]; tiles: Tile[]; subs: Record<string, Sub>; brands?: string[] }

export const MENUS: Menu[] = [
  {
    key: 'new', label: 'Новинки',
    rows: [{ label: 'Все новинки' }, { label: 'Одежда', sub: 'Одежда' }, { label: 'Обувь', sub: 'Обувь' }, { label: 'Сумки' }, { label: 'Аксессуары', sub: 'Аксессуары' }, { label: 'Оптика', sub: 'Оптика' }],
    tiles: [{ img: 't-new-week', caption: 'Пришло на этой неделе' }, { img: 't-look-week', caption: 'Образ недели' }],
    subs: {
      'Одежда': { rows: ['Вся одежда', 'Верхняя одежда', 'Платья и сарафаны', 'Рубашки и блузки', 'Деним', 'Брюки', 'Юбки', 'Трикотаж'], tiles: [{ img: 'p-val-jacket', caption: 'Valentino Куртка из кожи с поясом' }, { img: 'p-ag-skirt', caption: 'Agnona Юбка миди из шерсти' }] },
      'Обувь': { rows: ['Вся обувь', 'Лоферы', 'Мюли', 'Туфли', 'Ботинки и ботильоны', 'Кеды и кроссовки', 'Сапоги'] },
      'Аксессуары': { rows: ['Все аксессуары', 'Картхолдеры и портмоне', 'Ремни', 'Платки и шарфы', 'Перчатки'], tiles: [{ img: 'p-mm-belt', caption: 'Miu Miu Ремень из замши' }, { img: 'p-arcadie-black', caption: 'Miu Miu Сумка Arcadie' }] },
      'Оптика': { rows: ['Все очки', 'Солнцезащитные очки', 'Оправы'], tiles: [{ img: 'p-prada-symbole', caption: 'Prada Очки Symbole' }, { img: 'p-prada-round', caption: 'Prada Круглые очки Iconic Plaque' }] },
    },
  },
  {
    key: 'looks', label: 'Образы',
    rows: [{ label: 'Все образы' }, { label: 'Образ сезона', sub: 'Образ сезона' }, { label: 'В офис и после', sub: 'В офис и после' }, { label: 'Кожа и бархат', sub: 'Кожа и бархат' }, { label: 'На выход', sub: 'На выход' }, { label: 'Выходные в городе', sub: 'Выходные в городе' }],
    tiles: [{ img: 'l-mm-black', caption: 'В офис и после' }, { img: 'l-val-leather', caption: 'Кожа и бархат' }, { img: 'l-val-black', caption: 'На выход' }, { img: 't-weekend', caption: 'Выходные в городе' }],
    subs: {
      'Образ сезона': { look: { img: 'l-js-coat', story: 'coat', items: ['Jil Sander  ·  Пальто из шерсти', 'Jil Sander  ·  Широкие брюки', 'Jil Sander  ·  Туфли из кожи'] } },
      'В офис и после': { look: { img: 'l-mm-black', story: 'office', items: ['Miu Miu  ·  Рубашка из поплина', 'Miu Miu  ·  Юбка-карандаш', 'Miu Miu  ·  Сапоги из кожи'] } },
      'Кожа и бархат': { look: { img: 'l-val-leather', story: 'leather', items: ['Valentino  ·  Куртка из кожи с поясом', 'Valentino  ·  Юбка из твида', 'Valentino  ·  Сумка VSling'] } },
      'На выход': { look: { img: 'l-val-black', story: 'leather', items: ['Valentino  ·  Мини-платье из кади', 'Valentino  ·  Туфли из кожи', 'Valentino  ·  Клатч'] } },
      'Выходные в городе': { look: { img: 't-weekend', story: 'beige', items: ['Agnona  ·  Шуба из овчины', 'Agnona  ·  Брюки из джерси', 'Agnona  ·  Ботинки из замши'] } },
    },
  },
  {
    key: 'catalog', label: 'Каталог',
    rows: [{ label: 'Одежда', sub: 'Одежда' }, { label: 'Обувь', sub: 'Обувь' }, { label: 'Сумки' }, { label: 'Аксессуары', sub: 'Аксессуары' }, { label: 'Оптика', sub: 'Оптика' }, { label: 'Подарочный сертификат' }],
    tiles: [{ img: 't-new-season', caption: 'Новинки сезона' }, { img: 'p-bonnie-brown', caption: 'Сумки' }, { img: 't-outerwear', caption: 'Верхняя одежда' }, { img: 't-jackets', caption: 'Пиджаки и жакеты' }],
    subs: {
      'Одежда': { rows: ['Вся одежда', 'Верхняя одежда', 'Платья и сарафаны', 'Рубашки и блузки', 'Деним', 'Брюки', 'Юбки', 'Шорты', 'Пиджаки и жакеты', 'Пончо и накидки', 'Комбинезоны', 'Костюмы и комплекты', 'Футболки', 'Лонгсливы', 'Топы, майки, боди', 'Толстовки и худи', 'Водолазки и свитеры', 'Джемперы и кардиганы', 'Пляжная одежда'] },
      'Обувь': { rows: ['Вся обувь', 'Лоферы', 'Слипоны', 'Эспадрильи', 'Мюли', 'Туфли', 'Босоножки', 'Балетки', 'Сандалии и вьетнамки', 'Кеды и кроссовки', 'Сапоги', 'Ботинки и ботильоны'] },
      'Аксессуары': { rows: ['Все аксессуары', 'Косметички', 'Картхолдеры и портмоне', 'Ремни', 'Головные уборы', 'Платки и шарфы', 'Перчатки'], tiles: [{ img: 'p-mm-belt', caption: 'Miu Miu Ремень из замши' }, { img: 'p-arcadie-black', caption: 'Miu Miu Сумка Arcadie' }] },
      'Оптика': { rows: ['Все очки', 'Солнцезащитные очки', 'Оправы'], tiles: [{ img: 'p-prada-symbole', caption: 'Prada Очки Symbole' }, { img: 'p-prada-round', caption: 'Prada Круглые очки Iconic Plaque' }] },
    },
  },
  {
    key: 'brands', label: 'Бренды',
    rows: [{ label: 'Все бренды' }],
    brands: ['Agnona', 'Andre Maurice', 'Bacon', 'D.Exterior', 'Del Core', 'Flower Mountain', 'Haikure', 'Jil Sander', 'Maurizio', 'Manzoni24', 'Miu Miu', 'Missoni Mare', 'Neous', 'Prada', 'Santoni', 'Valentino', 'Valextra', '120% Lino'],
    tiles: [{ img: 'l-js-cardigan', caption: 'Jil Sander  |  Осень 2026' }, { img: 'p-prada-cartiglio', caption: 'Prada  |  Оптика' }],
    subs: {},
  },
]

export const SEARCH = {
  chips: ['Кожаное пальто', 'Jil Sander', 'Сумки Valextra', 'Кашемир', 'Santoni', 'Мини-юбка', 'Солнцезащитные очки'],
  categories: ['Верхняя одежда', 'Платья и сарафаны', 'Обувь', 'Сумки', 'Оптика'],
  popular: ['js-sweater', 'ag-skirt', 'prada-round'],
}

export const CART_INIT = [
  { id: 'ag-pants', qty: 1, size: '38', color: 'бежевый' },
  { id: 'js-turtleneck', qty: 1, size: 'S', color: 'серый' },
]
export const RECOMMENDED = ['prada-symbole', 'ag-sweater']

export const rub = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽'
export const img = (k: string) => `${import.meta.env.BASE_URL}img/${k}.jpg`
