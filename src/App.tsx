import { useMemo, useState } from 'react'
import './App.css'

type MemoType = 'text' | 'photo' | 'voice'
type MemoCategory = 'All' | 'Grocery' | 'Reminders' | 'Fun'

type Memo = {
  id: string
  author: string
  role: string
  timeLabel: string
  category: Exclude<MemoCategory, 'All'>
  type: MemoType
  content: string
  imageUrl?: string
  audioLength?: string
  liked: boolean
  starred: boolean
}

const categories: MemoCategory[] = ['All', 'Grocery', 'Reminders', 'Fun']

const defaultPhotoUrl =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAru3A5ExFjSkE1mPg9xA8_0Jj9tlq56YjPWGjynSHFgSNZdPEFXECsOXSG7koI1PxRELgBAP2ueJ0xFBhavieizLmqCTMT38dyy-jkkj9Mjk7sFjf8qdPdYTvd5rvez0PFlD6QdFIaoVcRdOZ_ads6kjizO05ZkXonLRTVi5eVeYT28')"

const initialMemos: Memo[] = [
  {
    id: 'memo-1',
    author: 'Mom',
    role: 'Grocery',
    timeLabel: '2h ago',
    category: 'Grocery',
    type: 'text',
    content: 'Don’t forget eggs and strawberries. Also grab pasta for dinner.',
    liked: true,
    starred: false,
  },
  {
    id: 'memo-2',
    author: 'Dad',
    role: 'Reminders',
    timeLabel: '3h ago',
    category: 'Reminders',
    type: 'photo',
    content: 'Fixed this today! No more leaks. 🛠️',
    imageUrl: defaultPhotoUrl,
    liked: false,
    starred: true,
  },
  {
    id: 'memo-3',
    author: 'Leo',
    role: 'Fun',
    timeLabel: '4h ago',
    category: 'Fun',
    type: 'voice',
    content: '"Can we have pizza tonight?"',
    audioLength: '0:04',
    liked: false,
    starred: false,
  },
]

function App() {
  const [memos, setMemos] = useState<Memo[]>(initialMemos)
  const [activeCategory, setActiveCategory] = useState<MemoCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [draftContent, setDraftContent] = useState('')
  const [draftCategory, setDraftCategory] = useState<Exclude<MemoCategory, 'All'>>('Grocery')
  const [draftType, setDraftType] = useState<MemoType>('text')

  const filteredMemos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return memos.filter((memo) => {
      const matchesCategory = activeCategory === 'All' || memo.category === activeCategory
      const matchesQuery =
        normalizedQuery.length === 0 ||
        memo.content.toLowerCase().includes(normalizedQuery) ||
        memo.author.toLowerCase().includes(normalizedQuery) ||
        memo.category.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, memos, searchQuery])

  const handleToggleLike = (memoId: string) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === memoId ? { ...memo, liked: !memo.liked } : memo)),
    )
  }

  const handleToggleStar = (memoId: string) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === memoId ? { ...memo, starred: !memo.starred } : memo)),
    )
  }

  const handleDelete = (memoId: string) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== memoId))
    setSelectedMemo((prev) => (prev?.id === memoId ? null : prev))
  }

  const handleAddMemo = () => {
    if (!draftContent.trim()) {
      return
    }
    const newMemo: Memo = {
      id: `memo-${Date.now()}`,
      author: 'You',
      role: draftCategory,
      timeLabel: 'just now',
      category: draftCategory,
      type: draftType,
      content: draftContent.trim(),
      imageUrl: draftType === 'photo' ? defaultPhotoUrl : undefined,
      audioLength: draftType === 'voice' ? '0:12' : undefined,
      liked: false,
      starred: false,
    }
    setMemos((prev) => [newMemo, ...prev])
    setDraftContent('')
    setDraftCategory('Grocery')
    setDraftType('text')
    setIsAddOpen(false)
  }

  return (
    <div className="relative mx-auto max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col">
      <header className="p-6 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">family_home</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Family Memo
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, Family!</h2>
        <p className="text-slate-500 text-sm">Today is Wednesday, Oct 25</p>
        {isSearchOpen ? (
          <div className="mt-4">
            <input
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Search memos, people, categories..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        ) : null}
      </header>

      <nav className="px-6 py-4 flex gap-6 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              className="flex flex-col items-center gap-1 group"
              onClick={() => setActiveCategory(category)}
            >
              <span
                className={`text-sm ${isActive ? 'font-bold text-primary' : 'font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`}
              >
                {category}
              </span>
              <div className={`h-1 w-4 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
            </button>
          )
        })}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {filteredMemos.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-12">
            No memos found. Try another keyword or category.
          </div>
        ) : null}

        {filteredMemos.map((memo) => (
          <div
            key={memo.id}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 cursor-pointer transition hover:shadow-md"
            onClick={() => setSelectedMemo(memo)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden bg-slate-200"
                  style={{
                    backgroundImage:
                      memo.author === 'Mom'
                        ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjNx9dr9csxXu_RrL53RNv4U3AGvU5PNnSdGKvXWLdHq-npPCKsBNnkFSOrUw56e_WUabXkizSnAyvfhpCZe6_1jeFHuwoDQe_ZDoMPyQTD7YC8h2a66WAwXcw1ZtQva15c9aRaMqVcrT_EdJfRkQ2zzkg9ZySzGtx8hBY3CNGj94BnCWZWvN8rb4ViVhFHToe0UHKUpk9EE3vVE4tfqlzpS3apCg5Eaa1E-41dTTxL7DSVhArn2CBa5hptYnJUr-ReUNVpYDu6WQ')"
                        : memo.author === 'Leo'
                          ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy49AJl3LDVfK3S8ZS-hlf84gcej3AJxlg-jzrsXiFmOtcXQKEqzOPxCXNbcTrRTUivGXEt1uYez6l06LqxBsZHJmx16roP3LtONBO2AJ4vjsfG0zGyuQUaZLtKu3J8MyDC95vAoMTF0e0sM6nys6IYMEZmZvVwLRMpLBIvFUMVCX_f9B-bX5gFiV84wJ2ujU-5DHcl84lFkciVMrgyiae-Kc1wlD1juQEx3Bfoan3mqjb_mCqlT-XnTs_W6em2eY6zFgg36uVHZI')"
                          : defaultPhotoUrl,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{memo.author}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {memo.role} • {memo.timeLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`text-slate-400 hover:text-primary ${memo.starred ? 'text-primary' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleToggleStar(memo.id)
                  }}
                >
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
                <button
                  className={`text-slate-400 hover:text-rose-500 ${memo.liked ? 'text-rose-500' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleToggleLike(memo.id)
                  }}
                >
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button
                  className="text-slate-400 hover:text-red-500"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDelete(memo.id)
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            {memo.type === 'text' ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                  {memo.content}
                </p>
              </div>
            ) : null}

            {memo.type === 'photo' ? (
              <div className="space-y-3">
                <div
                  className="w-full h-40 rounded-lg bg-slate-200"
                  style={{
                    backgroundImage: memo.imageUrl ?? defaultPhotoUrl,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <p className="text-slate-800 dark:text-slate-200 font-medium">{memo.content}</p>
              </div>
            ) : null}

            {memo.type === 'voice' ? (
              <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 flex items-center gap-4">
                <button
                  className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                  onClick={(event) => event.stopPropagation()}
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                </button>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium italic">
                    {memo.content}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3" />
                    </div>
                    <span className="text-[10px] font-bold text-primary">{memo.audioLength}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </main>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
        <button
          className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 border-4 border-white dark:border-slate-900 active:scale-95 transition-transform"
          onClick={() => setIsAddOpen(true)}
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {isAddOpen ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-30">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Memo</h3>
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setIsAddOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex gap-3">
              <select
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                value={draftCategory}
                onChange={(event) =>
                  setDraftCategory(event.target.value as Exclude<MemoCategory, 'All'>)
                }
              >
                {categories
                  .filter((category) => category !== 'All')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
              <select
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                value={draftType}
                onChange={(event) => setDraftType(event.target.value as MemoType)}
              >
                <option value="text">Text</option>
                <option value="photo">Photo</option>
                <option value="voice">Voice</option>
              </select>
            </div>
            <textarea
              className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Write a new memo..."
              value={draftContent}
              onChange={(event) => setDraftContent(event.target.value)}
            />
            <button
              className="w-full rounded-xl bg-primary text-white py-3 font-semibold disabled:opacity-50"
              onClick={handleAddMemo}
              disabled={!draftContent.trim()}
            >
              Add memo
            </button>
          </div>
        </div>
      ) : null}

      {selectedMemo ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-[92%] max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedMemo.author}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  {selectedMemo.role} • {selectedMemo.timeLabel}
                </p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setSelectedMemo(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {selectedMemo.type === 'photo' ? (
              <div
                className="w-full h-44 rounded-2xl bg-slate-200"
                style={{
                  backgroundImage: selectedMemo.imageUrl ?? defaultPhotoUrl,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ) : null}
            <p className="text-slate-800 dark:text-slate-200">{selectedMemo.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  className={`text-slate-400 hover:text-rose-500 ${selectedMemo.liked ? 'text-rose-500' : ''}`}
                  onClick={() => handleToggleLike(selectedMemo.id)}
                >
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button
                  className={`text-slate-400 hover:text-primary ${selectedMemo.starred ? 'text-primary' : ''}`}
                  onClick={() => handleToggleStar(selectedMemo.id)}
                >
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>
              <button
                className="text-sm text-red-500 font-semibold"
                onClick={() => handleDelete(selectedMemo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-10">
        <a className="flex flex-col items-center text-primary" href="#">
          <span className="material-symbols-outlined fill-1">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </a>
        <a className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">
          <span className="material-symbols-outlined">description</span>
          <span className="text-[10px] font-medium">Memos</span>
        </a>
        <div className="w-12" />
        <a className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px] font-medium">Events</span>
        </a>
        <a className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </a>
      </nav>
    </div>
  )
}

export default App
