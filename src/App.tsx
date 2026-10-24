import { useEffect, useMemo, useRef, useState } from 'react'
import {
  PRODUCTS, STORIES, SLIDES, LOOKBOOKS, BRAND_STORIES, MENUS, SEARCH, CART_INIT, RECOMMENDED,
  rub, img, type Product, type Menu,
} from './data'
import { IconBag, IconSearch, IconUser, IconChevronLeft, IconChevronRight, IconClose } from './icons'

const logo = (k: string) => `${import.meta.env.BASE_URL}logo/${k}.png`

type CartLine = { id: string; qty: number; size: string; color: string; img?: string }
type Panel =
  | { kind: 'menu'; key: string; sub?: string }
  | { kind: 'search' }
  | { kind: 'cart' }
  | { kind: 'look'; story: string; items?: string[]; title?: string; img?: string }
  | null

const LS = 'gq-cart-v1'
const loadCart = (): CartLine[] => {
  try { const v = localStorage.getItem(LS); if (v) return JSON.parse(v) } catch { /* ignore */ }
  return CART_INIT.map((c) => ({ ...c }))
}

/* Планшеты показывают макет; заглушка остаётся телефонам */
const NARROW = '(max-width: 767px)'

/* Длительность въезда и выезда панелей — как --panel-dur в styles.css */
const PANEL_MS = 600

/* ---------------- App ---------------- */
export default function App() {
  const [panel, setPanel] = useState<Panel>(null)
  const [cart, setCart] = useState<CartLine[]>(loadCart)
  const [scrolled, setScrolled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches)
  const [variant, setVariant] = useState<string>(() => new URLSearchParams(location.search).get('v') || localStorage.getItem('gq-v') || '1')

  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(cart)) } catch { /* ignore */ } }, [cart])
  useEffect(() => {
    document.documentElement.dataset.variant = variant
    try { localStorage.setItem('gq-v', variant) } catch { /* ignore */ }
  }, [variant])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const mq = window.matchMedia(NARROW)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(null) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => { document.body.style.overflow = panel ? 'hidden' : '' }, [panel])
  const [shown, setShown] = useState<Panel>(null)
  if (panel && panel !== shown) setShown(panel)
  const leaving = !panel && !!shown
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setShown(null), PANEL_MS)
    return () => clearTimeout(t)
  }, [leaving])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1800); return () => clearTimeout(t) }, [toast])

  const count = cart.reduce((s, l) => s + l.qty, 0)
  const add = (id: string, opts: { img?: string; color?: string; silent?: boolean } = {}) => {
    const p = PRODUCTS[id]
    setCart((c) => {
      const color = opts.color ?? p.colors?.[0]?.name.toLowerCase() ?? ''
      const i = c.findIndex((l) => l.id === id && l.color === color)
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n }
      return [...c, { id, qty: 1, size: 'One size', color, img: opts.img }]
    })
    if (!opts.silent) setToast(`${p.brand} ${p.name} в корзине`)
  }
  const ctx = { add, open: setPanel }

  if (narrow) return <div className="narrow-stop t-label">Макет не адаптирован под мобильную версию</div>

  return (
    <>
      <Header panel={panel} setPanel={setPanel} count={count} clear={!scrolled && !shown} />
      <main className="page">
        <Hero story="coat" image="h-coat" height={720} buttons={[{ label: 'Подробнее', on: () => setPanel({ kind: 'look', story: 'coat' }) }]} topShade />
        <SliderBlock {...ctx} />
        <Hero story="quiet" image="h-quiet" height={498} buttons={[
          { label: 'Купить', on: () => setPanel({ kind: 'look', story: 'quiet' }) },
          { label: 'Смотреть съёмку', on: () => setPanel({ kind: 'menu', key: 'looks', sub: 'Образ сезона' }) },
        ]} />
        <Lookbook images={LOOKBOOKS.quiet} onOpen={() => setPanel({ kind: 'look', story: 'quiet' })} />
        <Hero story="leather" image="h-leather" height={648} buttons={[
          { label: 'Купить образ', on: () => setPanel({ kind: 'look', story: 'leather' }) },
          { label: 'Подробнее', on: () => setPanel({ kind: 'menu', key: 'looks', sub: 'Кожа и бархат' }) },
        ]} />
        <Lookbook images={LOOKBOOKS.leather} onOpen={() => setPanel({ kind: 'look', story: 'leather' })} />
        <Hero story="office" image="h-office" height={558} buttons={[
          { label: 'Купить', on: () => setPanel({ kind: 'look', story: 'office' }) },
          { label: 'Подробнее', on: () => setPanel({ kind: 'menu', key: 'looks', sub: 'В офис и после' }) },
        ]} />
        <Lookbook images={LOOKBOOKS.office} onOpen={() => setPanel({ kind: 'look', story: 'office' })} />
        <Hero story="prada" image="h-prada" height={558} buttons={[
          { label: 'Купить', on: () => setPanel({ kind: 'look', story: 'prada' }) },
          { label: 'Подробнее', on: () => setPanel({ kind: 'menu', key: 'new', sub: 'Оптика' }) },
        ]} />
        <ProductRow ids={STORIES.prada.items} add={add} />
        <BrandStories onAll={() => setPanel({ kind: 'menu', key: 'brands' })} />
        <Footer />
      </main>

      {shown && <div className={`scrim fixed-page ${leaving ? 'is-leaving' : ''}`} onClick={() => setPanel(null)} />}
      {shown?.kind === 'menu' && <MenuPanel panel={shown} setPanel={setPanel} leaving={leaving} />}
      {shown?.kind === 'search' && <SearchPanel close={() => setPanel(null)} add={add} leaving={leaving} />}
      {shown?.kind === 'cart' && <CartDrawer cart={cart} setCart={setCart} add={add} close={() => setPanel(null)} leaving={leaving} />}
      {shown?.kind === 'look' && <LookDrawer panel={shown} add={add} close={() => setPanel(null)} openCart={() => setPanel({ kind: 'cart' })} leaving={leaving} />}
      {toast && <div className="toast fixed-page"><div className="t-button">{toast}</div></div>}

      <div className="vswitch t-micro" title="Вариант шрифтов">
        {['1', '2', '3'].map((v) => (
          <button key={v} className={variant === v ? 'on' : ''} onClick={() => setVariant(v)}>Вариант {v}</button>
        ))}
      </div>
    </>
  )
}

/* ---------------- Header ---------------- */
function Header({ panel, setPanel, count, clear }: { panel: Panel; setPanel: (p: Panel) => void; count: number; clear: boolean }) {
  const active = panel?.kind === 'menu' ? panel.key : null
  const toggle = (p: Panel) => setPanel(JSON.stringify(panel) === JSON.stringify(p) ? null : p)
  return (
    <header className={`header fixed-page ${clear ? 'is-clear' : 'is-solid'}`}>
      <nav className={`header__nav ${active ? 'has-active' : ''}`}>
        {MENUS.map((m) => (
          <button key={m.key} className={`t-label ${active === m.key ? 'is-active' : ''}`}
            onClick={() => toggle(active === m.key ? null : { kind: 'menu', key: m.key })}>{m.label}</button>
        ))}
      </nav>
      <a href="#" onClick={(e) => { e.preventDefault(); setPanel(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Glamorous Quake">
        <div className="header__logo" />
      </a>
      <div className="header__actions">
        <span className="t-label">Бутик</span>
        <button aria-label="Профиль"><IconUser /></button>
        <button aria-label="Поиск" onClick={() => toggle(panel?.kind === 'search' ? null : { kind: 'search' })}><IconSearch /></button>
        <button aria-label="Корзина" onClick={() => toggle(panel?.kind === 'cart' ? null : { kind: 'cart' })}><IconBag count={count} /></button>
      </div>
    </header>
  )
}

/* ---------------- Hero ---------------- */
type Btn = { label: string; on: () => void }
function Hero({ story, image, height, buttons, topShade }: { story: string; image: string; height: number; buttons: Btn[]; topShade?: boolean }) {
  const s = STORIES[story]
  return (
    <section className="hero" style={{ aspectRatio: `1440 / ${height}` }}>
      <img className="hero__img" src={img(image)} alt="" />
      {topShade && <div className="header__top-shade" />}
      <div className="hero__grad" />
      <div className="hero__bottom">
        <div className="hero__text">
          <h2 className="t-display">{s.title}</h2>
          <p className="t-body">{s.desc}</p>
        </div>
        <div className="btn-row">
          {buttons.map((b) => <button key={b.label} className="btn btn-image t-button" onClick={b.on}>{b.label}</button>)}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Slider: banner + products ---------------- */
function SliderBlock({ add, open }: { add: (id: string, o?: { img?: string; color?: string }) => void; open: (p: Panel) => void }) {
  const [i, setI] = useState(0)
  const n = SLIDES.length
  const go = (d: number) => setI((x) => (x + d + n) % n)
  useEffect(() => { const t = setInterval(() => go(1), 7000); return () => clearInterval(t) }, [i]) // eslint-disable-line react-hooks/exhaustive-deps
  const sl = SLIDES[i]
  const s = STORIES[sl.story]
  const items = sl.items ?? s.items
  return (
    <section>
      <div className="hero" style={{ aspectRatio: '1440 / 378' }}>
        {SLIDES.map((x, k) => <img key={x.hero} className="hero__img" src={img(x.hero)} alt="" style={{ opacity: k === i ? 1 : 0 }} />)}
        <div className="hero__grad" />
        <div className="hero__bottom">
          <div className="hero__text">
            <h2 className="t-display">{sl.titleOverride ?? s.title}</h2>
            <p className="t-body">{sl.descOverride ?? s.desc}</p>
          </div>
          <div className="btn-row">
            <button className="btn btn-image t-button" onClick={() => open({ kind: 'look', story: sl.story, items, title: sl.titleOverride ?? s.title, img: sl.hero })}>{sl.cta}</button>
          </div>
        </div>
        <div className="progress progress--light">{SLIDES.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
      </div>
      <ProductRow ids={items} add={add} key={i} onPrev={() => go(-1)} onNext={() => go(1)} />
    </section>
  )
}

function ProductRow({ ids, add, onPrev, onNext }: { ids: string[]; add: (id: string, o?: { img?: string; color?: string }) => void; onPrev?: () => void; onNext?: () => void }) {
  return (
    <div className="products">
      <div className="products__row">
        <button className="products__arrow products__arrow--l" onClick={onPrev} aria-label="Назад"><IconChevronLeft /></button>
        <div className="products__cards">{ids.map((id) => <ProductCard key={id} p={PRODUCTS[id]} add={add} />)}</div>
        <button className="products__arrow products__arrow--r" onClick={onNext} aria-label="Вперёд"><IconChevronRight /></button>
      </div>
      <button className="btn btn-outline t-button">Смотреть все</button>
    </div>
  )
}

function ProductCard({ p, add }: { p: Product; add: (id: string, o?: { img?: string; color?: string }) => void }) {
  const [c, setC] = useState(0)
  const col = p.colors?.[c]
  const src = col?.img ?? p.img
  return (
    <div className="pcard">
      <div className="pcard__photo" onClick={() => add(p.id, { img: src, color: col?.name.toLowerCase() })}>
        <img src={img(src)} alt={`${p.brand} ${p.name}`} />
        <div className="pcard__add t-button">В корзину</div>
      </div>
      <div className="pcard__meta">
        {p.badge && <span className="badge t-micro">{p.badge}</span>}
        <div className="t-product">{p.brand} {p.name}</div>
        <div className="price-row t-body"><span>{rub(p.price)}</span>{p.oldPrice && <span className="old-price">{rub(p.oldPrice)}</span>}</div>
        {p.colors && (
          <div className="swatches">
            {p.colors.map((x, k) => (
              <button key={x.name} className={`swatch ${k === c ? 'on' : ''}`} title={x.name} onClick={() => setC(k)}>
                <span style={{ background: x.hex }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Lookbook ---------------- */
function Lookbook({ images, onOpen }: { images: string[]; onOpen: () => void }) {
  return (
    <div className="lookbook">
      {images.map((k) => (
        <div key={k} className="lookframe" onClick={onOpen}>
          <img src={img(k)} alt="" />
          <span className="lookframe__bag"><IconBag size={18} /></span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Brand stories ---------------- */
function BrandStories({ onAll }: { onAll: () => void }) {
  const N = BRAND_STORIES.length
  const pages = Math.ceil(N / 4)
  const [pg, setPg] = useState(0)
  const step = Math.min(pg * 4, N - 4)
  return (
    <section className="stories">
      <h2 className="t-display">Истории брендов</h2>
      <div className="stories__viewport">
        <div className="stories__track" style={{ transform: `translateX(calc(${-step} * (var(--c6) + 12px)))` }}>
          {BRAND_STORIES.map((b) => (
            <div key={b.name} className="story" onClick={onAll}>
              <img className="story__img" src={img(b.img)} alt="" />
              <div className="story__shade" />
              {b.logo ? <img className="story__logo" src={logo(b.logo)} alt={b.name} />
                : <div className="story__name t-display">{b.name}</div>}
              <div className="story__cap t-body">{b.caption}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="scrollbar">
        <button disabled={pg === 0} onClick={() => setPg(pg - 1)} aria-label="Назад"><IconChevronLeft /></button>
        <div className="progress">{Array.from({ length: pages }, (_, k) => <i key={k} className={k === pg ? 'on' : ''} onClick={() => setPg(k)} />)}</div>
        <button disabled={pg === pages - 1} onClick={() => setPg(pg + 1)} aria-label="Вперёд"><IconChevronRight /></button>
      </div>
      <div className="center"><button className="btn btn-outline t-button" onClick={onAll}>Все бренды</button></div>
    </section>
  )
}

/* ---------------- Footer ---------------- */
function Footer() {
  const Col = ({ title, links, children }: { title: string; links?: string[]; children?: React.ReactNode }) => (
    <div className="footer__col">
      <h4 className="t-label">{title}</h4>
      {links && <div className="footer__links t-body">{links.map((l) => <a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>)}</div>}
      {children}
    </div>
  )
  const [sent, setSent] = useState(false)
  return (
    <footer className="footer">
      <div className="footer__cols">
        <Col title="Покупателю" links={['Доставка и оплата', 'Обмен и возврат', 'Подарочный сертификат', 'Вопросы и ответы']} />
        <Col title="О магазине" links={['О бутике', 'Бренды', 'Стилист онлайн', 'Контакты']} />
        <div className="footer__logo"><img src={logo('footer')} alt="Glamorous Quake, Горького 5" /></div>
        <Col title="Соцсети" links={['Telegram', 'Instagram*', 'Написать в Telegram']}>
          <p className="t-body footer__note">*Meta Platforms запрещена на территории РФ</p>
        </Col>
        <Col title="Подписка на новости">
          <p className="t-body footer__note">Новые поступления и образы недели. Одно письмо в неделю.</p>
          <form className="footer__links" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <label className="field t-body"><input type="email" required placeholder="Ваш email" /></label>
            <button className="btn btn-primary t-button btn-block">{sent ? 'Готово, спасибо' : 'Подписаться'}</button>
          </form>
        </Col>
      </div>
      <div className="footer__bar">
        <div className="hr" />
        <div className="footer__bottom t-body">
          <span>© 2026 Glamorous Quake</span>
          <div className="footer__selects">
            <span>Город</span><span className="select t-body">Магнитогорск <IconChevronRight size={14} /></span>
            <span>Валюта</span><span className="select t-body">RU / ₽ <IconChevronRight size={14} /></span>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()}>Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  )
}

/* ---------------- Menu ---------------- */
function MenuPanel({ panel, setPanel, leaving }: { panel: Extract<Panel, { kind: 'menu' }>; setPanel: (p: Panel) => void; leaving: boolean }) {
  const m = MENUS.find((x) => x.key === panel.key) as Menu
  const sub = panel.sub ? m.subs[panel.sub] : undefined
  // Въезжает только то, с чем меню открыли. Переключение разделов меню — без въезда, подменю — из-под основной панели.
  const intro = useRef({ key: panel.key as string | null, sub: panel.sub ?? null, main: panel.sub ? 'in-left-block' : 'in-left' })
  if (intro.current.key !== panel.key) intro.current.key = null
  if (intro.current.sub !== (panel.sub ?? null)) intro.current.sub = null
  const mainIn = intro.current.key === panel.key ? intro.current.main : ''
  const subIn = panel.sub && intro.current.sub === panel.sub ? 'in-left-block' : ''
  return (
    <div className={`menu fixed-page ${sub ? 'has-sub' : ''} ${leaving ? 'is-leaving' : ''}`}>
      <div className={`menu__panel ${mainIn}`} key={m.key}>
        {m.rows.map((r) => (
          <button key={r.label} className={`mrow ${panel.sub && panel.sub !== r.sub ? 'is-dim' : ''}`}
            onClick={() => r.sub ? setPanel({ kind: 'menu', key: m.key, sub: r.sub }) : setPanel(null)}>
            <span className="mrow__label t-label">{r.label}</span>
            {r.sub && <IconChevronRight size={14} />}
          </button>
        ))}
        {m.brands && (
          <>
            <div className="spacer-24" />
            <div className="brand-cols">
              {[0, 1].map((c) => (
                <div key={c}>{m.brands!.slice(c * 9, c * 9 + 9).map((b) => (
                  <button key={b} className="mrow" onClick={() => setPanel(null)}><span className="mrow__label t-label">{b}</span></button>
                ))}</div>
              ))}
            </div>
          </>
        )}
        <div className="spacer-24" />
        <div className="tiles">
          {m.tiles.map((t) => (
            <div key={t.caption} className="tile">
              <div className="tile__img"><img src={img(t.img)} alt="" /></div>
              <div className="t-body">{t.caption}</div>
            </div>
          ))}
        </div>
      </div>
      {sub && (
        <div className={`menu__panel menu__panel--2 ${subIn}`} key={panel.sub}>
          {sub.rows?.map((r) => (
            <button key={r} className="mrow" onClick={() => setPanel(null)}><span className="mrow__label t-label">{r}</span></button>
          ))}
          {sub.tiles && (
            <>
              <div className="spacer-24" />
              <div className="tiles">{sub.tiles.map((t) => (
                <div key={t.caption} className="tile">
                  <div className="tile__img"><img src={img(t.img)} alt="" /></div>
                  <div className="t-body">{t.caption}</div>
                </div>
              ))}</div>
            </>
          )}
          {sub.look && (
            <>
              <div className="tile__img" style={{ width: 'var(--c8)', aspectRatio: '464 / 524' }}><img src={img(sub.look.img)} alt="" /></div>
              <div style={{ height: 12 }} />
              {sub.look.items.map((r) => (
                <button key={r} className="mrow" onClick={() => setPanel({ kind: 'look', story: sub.look!.story })}><span className="mrow__label t-label">{r}</span></button>
              ))}
              <div className="spacer-24" />
              <button className="btn btn-primary t-button btn-block" onClick={() => setPanel({ kind: 'look', story: sub.look!.story })}>Купить образ</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- Search ---------------- */
function SearchPanel({ close, add, leaving }: { close: () => void; add: (id: string, o?: { img?: string; color?: string }) => void; leaving: boolean }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return SEARCH.popular.map((id) => PRODUCTS[id])
    return Object.values(PRODUCTS).filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(s)).slice(0, 3)
  }, [q])
  return (
    <div className={`search fixed-page ${leaving ? 'is-leaving' : ''}`}>
      <div className="search__input">
        <input autoFocus className="t-heading" placeholder="Поиск по бренду, категории или вещи" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="t-button" style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={close}>Закрыть <IconClose size={18} /></button>
      </div>
      <div className="search__cols">
        <div style={{ width: 'var(--c8)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="t-label">Популярные запросы</div>
          <div className="chips">{SEARCH.chips.map((c) => <button key={c} className="chip t-body" onClick={() => setQ(c)}>{c}</button>)}</div>
        </div>
        <div style={{ width: 'var(--c4)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="t-label">Категории</div>
          <div className="linklist t-body">{SEARCH.categories.map((c) => <button key={c} onClick={() => setQ(c)}>{c}</button>)}</div>
        </div>
        <div style={{ width: 'var(--c12)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="t-label">{q.trim() ? `Найдено: ${results.length}` : 'Популярные товары'}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {results.length ? results.map((p) => <ProductCard key={p.id} p={p} add={add} />) : <div className="t-body dim">Ничего не нашлось. Попробуйте «Jil Sander» или «очки».</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Cart ---------------- */
function CartDrawer({ cart, setCart, add, close, leaving }: { cart: CartLine[]; setCart: (f: (c: CartLine[]) => CartLine[]) => void; add: (id: string, o?: { silent?: boolean }) => void; close: () => void; leaving: boolean }) {
  const count = cart.reduce((s, l) => s + l.qty, 0)
  const total = cart.reduce((s, l) => s + PRODUCTS[l.id].price * l.qty, 0)
  const upd = (k: number, d: number) => setCart((c) => c.map((l, i) => (i === k ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0))
  const reco = RECOMMENDED.filter((id) => !cart.some((l) => l.id === id))
  const [done, setDone] = useState(false)
  return (
    <div className={`drawer fixed-page ${leaving ? 'is-leaving' : ''}`}>
      <aside className="drawer__panel">
        <div className="drawer__top">
          <h3 className="t-heading-s">Корзина ({count})</h3>
          <button onClick={close} aria-label="Закрыть"><IconClose /></button>
        </div>
        <div className="drawer__body">
          {cart.length === 0 && <div className="empty t-body">В корзине пока пусто. Добавьте вещи из образов на главной.</div>}
          {cart.map((l, k) => {
            const p = PRODUCTS[l.id]
            return (
              <div key={l.id + l.color}>
                <div className="citem">
                  <div className="citem__img"><img src={img(l.img ?? p.img)} alt="" /></div>
                  <div className="citem__info">
                    <div className="citem__head"><span className="t-label">{p.brand}</span><span className="t-body">{rub(p.price * l.qty)}</span></div>
                    <div className="t-product">{p.name}</div>
                    <div className="t-body dim">Размер: {l.size}{l.color ? `  ·  Цвет: ${l.color}` : ''}</div>
                    <div className="citem__actions">
                      <div className="qty t-body"><button onClick={() => upd(k, -1)}>−</button><span>{l.qty}</span><button onClick={() => upd(k, 1)}>+</button></div>
                      <button className="t-body underline" onClick={() => upd(k, -l.qty)}>Удалить</button>
                    </div>
                  </div>
                </div>
                <div className="hr" style={{ marginTop: 24 }} />
              </div>
            )
          })}
          {reco.length > 0 && (
            <>
              <h4 className="t-heading-s">Дополните образ</h4>
              <div className="reco">
                {reco.map((id) => {
                  const p = PRODUCTS[id]
                  return (
                    <div key={id}>
                      <div className="citem">
                        <div className="citem__img"><img src={img(p.img)} alt="" /></div>
                        <div className="citem__info">
                          <span className="t-label">{p.brand}</span>
                          <span className="t-product">{p.name}</span>
                          <span className="t-body">{rub(p.price)}</span>
                        </div>
                      </div>
                      <button className="btn btn-outline t-button btn-block" onClick={() => add(id, { silent: true })}>В корзину</button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
        <div className="drawer__sum">
          <div className="sum-row"><span className="t-label">Итого</span><span className="t-heading-s">{rub(total)}</span></div>
          <p className="t-body dim">{done ? 'Это демо: заказ не отправляется. Спасибо, что заглянули!' : 'Доставку рассчитаем при оформлении. Вещи можно примерить в бутике на Горького, 5.'}</p>
          <div className="btn-row">
            <button className="btn btn-primary t-button" disabled={!cart.length} onClick={() => setDone(true)}>Оформить заказ</button>
            <button className="btn btn-outline t-button" onClick={() => setDone(true)}>Отложить для примерки</button>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ---------------- Shop the look ---------------- */
function LookDrawer({ panel, add, close, openCart, leaving }: { panel: Extract<Panel, { kind: 'look' }>; add: (id: string, o?: { silent?: boolean; img?: string }) => void; close: () => void; openCart: () => void; leaving: boolean }) {
  const s = STORIES[panel.story]
  const items = panel.items ?? s.items
  const total = items.reduce((t, id) => t + PRODUCTS[id].price, 0)
  const [added, setAdded] = useState<Record<string, boolean>>({})
  const word = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'вещь' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'вещи' : 'вещей')
  return (
    <div className={`drawer fixed-page ${leaving ? 'is-leaving' : ''}`}>
      <aside className="drawer__panel">
        <div className="drawer__top" style={{ minHeight: 76 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="t-label dim">{s.kicker}</span>
            <h3 className="t-heading-s">{panel.title ?? s.title}</h3>
          </div>
          <button onClick={close} aria-label="Закрыть"><IconClose /></button>
        </div>
        <div className="drawer__body" style={{ gap: 0, paddingTop: 0 }}>
          {items.map((id) => {
            const p = PRODUCTS[id]
            return (
              <div key={id} className="look-item">
                <div className="citem">
                  <div className="citem__img"><img src={img(p.img)} alt="" /></div>
                  <div className="citem__info">
                    <span className="t-label">{p.brand}</span>
                    <span className="t-product">{p.name}</span>
                    <div className="price-row t-body"><span>{rub(p.price)}</span>{p.oldPrice && <span className="old-price">{rub(p.oldPrice)}</span>}</div>
                  </div>
                </div>
                <div className="btn-row">
                  <span className="select t-body" style={{ flex: 1, justifyContent: 'space-between' }}>Размер {p.colors ? 'One size' : '38'} <IconChevronRight size={14} /></span>
                  <button className={`btn ${added[id] ? 'btn-primary' : 'btn-outline'} t-button`} style={{ flex: 1 }}
                    onClick={() => { add(id, { silent: true }); setAdded((a) => ({ ...a, [id]: true })) }}>{added[id] ? 'Добавлено' : 'Добавить в корзину'}</button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="drawer__sum">
          <div className="sum-row"><span className="t-label">Весь образ, {items.length} {word(items.length)}</span><span className="t-heading-s">{rub(total)}</span></div>
          <div className="btn-row">
            <button className="btn btn-primary t-button" onClick={() => { items.forEach((id) => add(id, { silent: true })); openCart() }}>Добавить весь образ</button>
            <button className="btn btn-outline t-button" onClick={close}>Вся история</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
