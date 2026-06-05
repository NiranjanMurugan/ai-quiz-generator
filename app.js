/* ================================================
   APP.JS — Application State Machine & Orchestrator
   Wires Engine, Renderer, Storage together
   ================================================ */

const App = (() => {

  /* ──────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────── */
  let state = {
    view: 'home',          // home|generating|flashcards|study|quiz|results|history
    currentSet: null,      // { id, topic, flashcards, quiz }
    filteredCards: [],     // filtered flashcard list (for grid)
    filterDifficulty: 'all',
    study: {
      index: 0,
      isFlipped: false,
      showHint: false,
      ratings: { easy: 0, hard: 0, again: 0 },
      queue: [],           // copy of cards for this session
    },
    quiz: {
      index: 0,
      score: 0,
      answered: false,
      selfAssessed: false,
      results: [],
      timerSeconds: 300,
      timerId: null,
    }
  };

  /* ──────────────────────────────────────────────
     VIEW ROUTING
  ────────────────────────────────────────────── */
  const VIEWS = ['home', 'generating', 'flashcards', 'study', 'quiz', 'results', 'history'];

  function showView(name) {
    state.view = name;
    VIEWS.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.toggle('active', v === name);
    });

    const bottomNav = document.getElementById('bottom-nav');
    const showBottom = name === 'home';
    if (bottomNav) bottomNav.style.display = showBottom ? 'flex' : 'none';

    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === 'home' && name === 'home');
    });

    if (name !== 'quiz') stopQuizTimer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatTimer(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function stopQuizTimer() {
    if (state.quiz.timerId) {
      clearInterval(state.quiz.timerId);
      state.quiz.timerId = null;
    }
  }

  function startQuizTimer() {
    stopQuizTimer();
    const count = parseInt(document.getElementById('count-select')?.value || '10', 10);
    state.quiz.timerSeconds = Math.max(120, count * 30);
    const el = document.getElementById('quiz-timer');
    if (el) el.textContent = formatTimer(state.quiz.timerSeconds);

    state.quiz.timerId = setInterval(() => {
      state.quiz.timerSeconds--;
      const timerEl = document.getElementById('quiz-timer');
      if (timerEl) timerEl.textContent = formatTimer(Math.max(0, state.quiz.timerSeconds));
      if (state.quiz.timerSeconds <= 0) {
        stopQuizTimer();
        toast("Time's up!", 'info');
        finishQuiz();
      }
    }, 1000);
  }

  /* ──────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ────────────────────────────────────────────── */
  function toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  /* ──────────────────────────────────────────────
     GENERATE FLOW
  ────────────────────────────────────────────── */
  function startGenerate() {
    const input = document.getElementById('topic-input')?.value?.trim();
    if (!input) { toast('Please enter a topic or paste some text first.', 'error'); return; }

    const mode      = document.querySelector('.mode-btn.active')?.dataset?.mode || 'both';
    const count     = parseInt(document.getElementById('count-select')?.value || '10');
    const difficulty = document.getElementById('difficulty-select')?.value || null;
    const level     = document.getElementById('level-select')?.value || 'intermediate';

    const config = Engine.parseCommand(input);
    config.mode = config.mode !== 'both' ? config.mode : mode; // Command overrides UI if specific
    config.count = config.count || count;
    config.difficulty = config.difficulty || (difficulty !== 'balanced' ? difficulty : null);
    config.level = level;

    showView('generating');

    // Simulate processing delay for UX
    setTimeout(async () => {
      try {
        const result = Engine.generate(config);
        state.currentSet = result;

        // Auto-save to database / local storage
        await Storage.save({
          id: result.id,
          topic: result.topic || config.topic,
          flashcards: result.flashcards,
          quiz: result.quiz,
        });

        // Update content header
        const headerTitle = document.getElementById('content-title');
        const headerMeta  = document.getElementById('content-meta');
        if (headerTitle) headerTitle.textContent = result.topic || config.topic;
        if (headerMeta) {
          const fc = result.flashcards?.length || 0;
          const q  = result.quiz?.total || 0;
          headerMeta.textContent = `${fc} flashcards · ${q} quiz questions`;
        }

        // Decide which view to show
        if (config.mode === 'quiz' && result.quiz) {
          startQuiz();
        } else {
          showFlashcards();
        }
      } catch (err) {
        console.error(err);
        toast('Something went wrong. Please try again.', 'error');
        showView('home');
      }
    }, 1200);
  }

  /* ──────────────────────────────────────────────
     FLASHCARDS VIEW
  ────────────────────────────────────────────── */
  function showFlashcards(set) {
    if (set) state.currentSet = set;
    if (!state.currentSet?.flashcards?.length) {
      // If only quiz mode was generated, go to quiz
      if (state.currentSet?.quiz) { startQuiz(); return; }
      toast('No flashcards available.', 'error');
      showView('home');
      return;
    }

    state.filteredCards = [...state.currentSet.flashcards];
    state.filterDifficulty = 'all';

    // Update header
    const ht = document.getElementById('content-title');
    const hm = document.getElementById('content-meta');
    if (ht) ht.textContent = state.currentSet.topic || 'Flashcards';
    if (hm) hm.textContent = `${state.currentSet.flashcards.length} cards · ${state.currentSet.quiz?.total || 0} quiz questions`;

    // Reset filter chips
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.filter-chip[data-filter="all"]')?.classList.add('active');

    Renderer.renderFlashcardGrid(state.filteredCards, 'cards-grid');
    showView('flashcards');
  }

  function applyFilter(difficulty) {
    state.filterDifficulty = difficulty;
    const cards = state.currentSet?.flashcards || [];
    state.filteredCards = difficulty === 'all' ? [...cards] : cards.filter(c => c.difficulty === difficulty);
    Renderer.renderFlashcardGrid(state.filteredCards, 'cards-grid');

    document.querySelectorAll('.filter-chip').forEach(c =>
      c.classList.toggle('active', c.dataset.filter === difficulty));
  }

  /* ──────────────────────────────────────────────
     STUDY MODE
  ────────────────────────────────────────────── */
  function startStudy() {
    const cards = state.currentSet?.flashcards;
    if (!cards?.length) { toast('No flashcards to study.', 'error'); return; }

    state.study = {
      index: 0,
      isFlipped: false,
      showHint: false,
      ratings: { easy: 0, hard: 0, again: 0 },
      queue: Engine.shuffle([...cards])
    };

    updateStudyCard();
    showView('study');
  }

  function updateStudyCard() {
    const { queue, index } = state.study;
    if (index >= queue.length) {
      // Study complete
      const container = document.getElementById('study-card-container');
      if (container) Renderer.renderStudyComplete(state.study.ratings, container);
      const controls = document.getElementById('study-controls');
      if (controls) controls.style.display = 'none';
      setupStudyCompleteButtons();
      return;
    }

    const card = queue[index];
    state.study.isFlipped = false;
    state.study.showHint = false;

    const container = document.getElementById('study-card-container');
    if (container) Renderer.renderStudyCard(card, container, false);

    // Wire flip click
    const cardEl = document.getElementById('study-card');
    if (cardEl) {
      cardEl.addEventListener('click', toggleStudyFlip);
    }

    // Update progress
    const fill = document.getElementById('study-progress-fill');
    const label = document.getElementById('study-progress-label-current');
    const labelTotal = document.getElementById('study-progress-label-total');
    if (fill) fill.style.width = `${((index) / queue.length) * 100}%`;
    if (label) label.textContent = index + 1;
    if (labelTotal) labelTotal.textContent = queue.length;

    // Show/hide rating buttons after flip
    const ratingRow = document.getElementById('rating-buttons');
    if (ratingRow) ratingRow.style.display = 'none';
    const controls = document.getElementById('study-controls');
    if (controls) controls.style.display = 'flex';
  }

  function toggleStudyFlip() {
    const cardEl = document.getElementById('study-card');
    if (!cardEl) return;
    state.study.isFlipped = !state.study.isFlipped;
    cardEl.classList.toggle('flipped', state.study.isFlipped);

    // Show rating buttons once flipped to answer
    const ratingRow = document.getElementById('rating-buttons');
    if (ratingRow) ratingRow.style.display = state.study.isFlipped ? 'flex' : 'none';
  }

  function rateCard(rating) {
    state.study.ratings[rating] = (state.study.ratings[rating] || 0) + 1;
    state.study.index++;
    updateStudyCard();
  }

  function toggleStudyHint() {
    const hintBox = document.getElementById('study-hint-box');
    if (hintBox) hintBox.classList.toggle('visible');
  }

  function setupStudyCompleteButtons() {
    setTimeout(() => {
      document.getElementById('study-restart-btn')?.addEventListener('click', startStudy);
      document.getElementById('study-back-btn')?.addEventListener('click', () => showFlashcards());
    }, 100);
  }

  /* ──────────────────────────────────────────────
     QUIZ MODE
  ────────────────────────────────────────────── */
  function startQuiz() {
    const quiz = state.currentSet?.quiz;
    if (!quiz?.questions?.length) {
      toast('No quiz questions available.', 'error');
      return;
    }

    state.quiz = {
      index: 0,
      score: 0,
      answered: false,
      selfAssessed: false,
      results: [],
      timerSeconds: 300,
      timerId: null,
    };

    updateQuizTitle();
    renderCurrentQuestion();
    showView('quiz');
    startQuizTimer();
  }

  function updateQuizTitle() {
    const quiz = state.currentSet.quiz;
    const qLabel = document.getElementById('quiz-q-label');
    if (qLabel) qLabel.textContent = `Question ${state.quiz.index + 1} of ${quiz.total} · Score ${state.quiz.score}/${quiz.total}`;
  }

  function renderCurrentQuestion() {
    const quiz = state.currentSet.quiz;
    const q    = quiz.questions[state.quiz.index];
    if (!q) { finishQuiz(); return; }

    state.quiz.answered    = false;
    state.quiz.selfAssessed = false;

    const container = document.getElementById('quiz-question-container');
    if (container) Renderer.renderQuizQuestion(q, container);

    updateQuizTitle();
    updateQuizNav();
  }

  function updateQuizNav() {
    const submitBtn = document.getElementById('quiz-submit-btn');
    const nextBtn   = document.getElementById('quiz-next-btn');
    const quiz      = state.currentSet.quiz;
    const isLast    = state.quiz.index >= quiz.total - 1;
    const q         = quiz.questions[state.quiz.index];

    // For MCQ/TF/Matching: submit happens inline; show only Next
    if (submitBtn) {
      // Already rendered inside the question area
    }
    if (nextBtn) {
      nextBtn.textContent = isLast ? 'See Results →' : 'Next Question →';
      nextBtn.disabled = !state.quiz.answered && q?.type !== 'short_answer';
    }
  }

  function advanceQuiz() {
    const quiz = state.currentSet.quiz;
    if (state.quiz.index >= quiz.total - 1) {
      finishQuiz();
    } else {
      state.quiz.index++;
      renderCurrentQuestion();
    }
  }

  function finishQuiz() {
    stopQuizTimer();
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      Renderer.renderResults({
        correct: state.quiz.score,
        total: state.currentSet.quiz.total,
        results: state.quiz.results
      }, resultsContainer);
      setupResultButtons();
    }
    showView('results');
  }

  function setupResultButtons() {
    setTimeout(() => {
      document.getElementById('results-retake-btn')?.addEventListener('click', startQuiz);
      document.getElementById('results-flashcards-btn')?.addEventListener('click', () => showFlashcards());
      document.getElementById('results-export-btn')?.addEventListener('click', openExportModal);
      document.getElementById('results-home-btn')?.addEventListener('click', () => showView('home'));
    }, 100);
  }

  /* ──────────────────────────────────────────────
     HISTORY
  ────────────────────────────────────────────── */
  async function showHistory() {
    try {
      const sets = await Storage.load();
      const container = document.getElementById('history-grid');
      Renderer.renderHistory(sets, container);
      showView('history');
    } catch {
      toast('Could not load saved sets.', 'error');
    }
  }

  async function loadFromHistory(id) {
    try {
      const set = await Storage.get(id);
      if (!set) { toast('Set not found.', 'error'); return; }
      state.currentSet = set;
      showFlashcards(set);
    } catch {
      toast('Could not load this set.', 'error');
    }
  }

  async function deleteFromHistory(id) {
    try {
      await Storage.remove(id);
      toast('Set deleted.', 'success');
      showHistory();
    } catch {
      toast('Could not delete set.', 'error');
    }
  }

  /* ──────────────────────────────────────────────
     EXPORT
  ────────────────────────────────────────────── */
  function openExportModal() {
    const overlay = document.getElementById('export-modal');
    if (overlay) overlay.classList.add('active');
  }
  function closeExportModal() {
    const overlay = document.getElementById('export-modal');
    if (overlay) overlay.classList.remove('active');
  }

  function exportJSON() {
    const set = state.currentSet;
    if (!set) return;
    const blob = new Blob([JSON.stringify(set, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${(set.topic || 'flashcards').replace(/\s+/g, '_')}.json`);
    toast('JSON exported!', 'success');
    closeExportModal();
  }

  function exportHTML() {
    const set = state.currentSet;
    if (!set) return;
    const cards = (set.flashcards || []).map((c, i) => `
      <div style="page-break-inside:avoid;border:1px solid #ddd;border-radius:8px;padding:16px;margin-bottom:12px;font-family:sans-serif;">
        <div style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${i+1} · ${c.difficulty}</div>
        <div style="font-weight:600;font-size:1rem;margin-bottom:8px;">${Renderer.escapeHtml(c.front)}</div>
        <hr style="border:none;border-top:1px dashed #ddd;margin:8px 0;">
        <div style="color:#444;font-size:0.9rem;">${Renderer.escapeHtml(c.back)}</div>
        ${c.hint ? `<div style="color:#888;font-size:0.8rem;margin-top:6px;">💡 ${Renderer.escapeHtml(c.hint)}</div>` : ''}
      </div>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${Renderer.escapeHtml(set.topic || 'Flashcards')}</title>
<style>body{font-family:sans-serif;max-width:720px;margin:0 auto;padding:32px;background:#f9f9f9;}h1{text-align:center;}</style>
</head>
<body>
<h1>${Renderer.escapeHtml(set.topic || 'Flashcards')}</h1>
<p style="text-align:center;color:#666;">${set.flashcards?.length || 0} flashcards · Generated by AI Quiz Maker</p>
${cards}
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    downloadBlob(blob, `${(set.topic || 'flashcards').replace(/\s+/g, '_')}.html`);
    toast('HTML exported!', 'success');
    closeExportModal();
  }

  function copyJSON() {
    const set = state.currentSet;
    if (!set) return;
    navigator.clipboard.writeText(JSON.stringify(set, null, 2)).then(() => {
      toast('JSON copied to clipboard!', 'success');
      closeExportModal();
    }).catch(() => toast('Copy failed — try exporting as JSON.', 'error'));
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  /* ──────────────────────────────────────────────
     KEYBOARD SHORTCUTS
  ────────────────────────────────────────────── */
  function setupKeyboard() {
    document.addEventListener('keydown', e => {
      // Ignore when typing in inputs
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

      if (state.view === 'study') {
        if (e.code === 'Space') { e.preventDefault(); toggleStudyFlip(); }
        if (e.code === 'ArrowRight') { if (state.study.isFlipped) rateCard('easy'); }
        if (e.code === 'ArrowLeft')  { if (state.study.isFlipped) rateCard('again'); }
        if (e.code === 'ArrowDown')  { if (state.study.isFlipped) rateCard('hard'); }
        if (e.key === 'h' || e.key === 'H') toggleStudyHint();
        if (e.key === 'Escape') showFlashcards();
      }

      if (state.view === 'quiz') {
        if (e.code === 'Enter' && state.quiz.answered) advanceQuiz();
      }

      if (state.view === 'flashcards') {
        if (e.key === 'Escape') showView('home');
      }

      if (e.key === 'Escape' && state.view !== 'home') {
        const modal = document.getElementById('export-modal');
        if (modal?.classList.contains('active')) { closeExportModal(); return; }
      }
    });
  }

  /* ──────────────────────────────────────────────
     EVENT WIRING
  ────────────────────────────────────────────── */
  function wireEvents() {

    // Generate button
    document.getElementById('generate-btn')?.addEventListener('click', startGenerate);

    // Enter key in topic input
    document.getElementById('topic-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) startGenerate();
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Quick topic chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('topic-input');
        if (input) input.value = chip.dataset.topic;
        input?.focus();
      });
    });

    document.querySelector('.navbar-logo')?.addEventListener('click', () => {
      if (state.view !== 'home') showView('home');
    });

    document.getElementById('history-new-btn')?.addEventListener('click', () => showView('home'));

    document.getElementById('daily-quiz-btn')?.addEventListener('click', () => {
      const input = document.getElementById('topic-input');
      if (input && !input.value.trim()) {
        const topics = Engine.TOPICS || ['Biology', 'Python Programming', 'World History'];
        input.value = topics[Math.floor(Math.random() * topics.length)];
      }
      document.getElementById('generate-btn')?.click();
    });

    document.querySelectorAll('.mascot-card').forEach(card => {
      card.addEventListener('click', () => {
        const input = document.getElementById('topic-input');
        if (input) input.value = card.dataset.topic || '';
        input?.focus();
        document.getElementById('topic-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.category;
        if (cat && cat !== 'all' && Engine.TOPICS) {
          const filtered = Engine.TOPICS.filter(t =>
            cat === 'popular' ? true : t.toLowerCase().includes(cat === 'tech' ? 'python' : cat.slice(0, 4))
          );
          const pick = filtered[Math.floor(Math.random() * filtered.length)] || Engine.TOPICS[0];
          const input = document.getElementById('topic-input');
          if (input) input.value = pick;
        }
      });
    });

    document.getElementById('bottom-history-btn')?.addEventListener('click', showHistory);
    document.getElementById('bottom-create-btn')?.addEventListener('click', () => {
      showView('home');
      document.getElementById('topic-input')?.focus();
    });
    document.querySelector('.bottom-nav-item[data-nav="home"]')?.addEventListener('click', () => showView('home'));

    // Navbar history button
    document.getElementById('nav-history-btn')?.addEventListener('click', showHistory);

    // Navbar export button
    document.getElementById('nav-export-btn')?.addEventListener('click', () => {
      if (state.currentSet) openExportModal();
      else toast('Generate a set first to export.', 'info');
    });

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
    });

    // Content header actions
    document.getElementById('start-study-btn')?.addEventListener('click', startStudy);
    document.getElementById('start-quiz-btn')?.addEventListener('click',  startQuiz);
    document.getElementById('export-btn')?.addEventListener('click',      openExportModal);
    document.getElementById('new-set-btn')?.addEventListener('click',     () => showView('home'));

    // Study controls
    document.getElementById('study-flip-btn')?.addEventListener('click', toggleStudyFlip);
    document.getElementById('study-prev-btn')?.addEventListener('click', () => {
      if (state.study.index > 0) { state.study.index--; updateStudyCard(); }
    });
    document.getElementById('study-next-btn')?.addEventListener('click', () => {
      state.study.index++;
      updateStudyCard();
    });
    document.getElementById('study-hint-btn')?.addEventListener('click', toggleStudyHint);
    document.getElementById('study-exit-btn')?.addEventListener('click', () => showFlashcards());

    // Rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => rateCard(btn.dataset.rating));
    });

    // Quiz answered event (fired by renderer)
    document.addEventListener('quiz:answered', e => {
      const { isCorrect, correctAnswer } = e.detail;
      state.quiz.answered = true;

      const quiz = state.currentSet.quiz;
      const q    = quiz.questions[state.quiz.index];

      // Update score
      if (isCorrect === true)  state.quiz.score++;
      // Short answer is self-assessed — we mark it but don't auto-score

      state.quiz.results.push({
        question: q.question || q.statement || q.instruction || 'Question',
        isCorrect,
        correctAnswer
      });

      updateQuizNav();

      // Enable next button
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) nextBtn.disabled = false;
    });

    // Quiz next button
    document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
      if (!state.quiz.answered) {
        // Allow skip for short_answer
        const quiz = state.currentSet?.quiz;
        const q = quiz?.questions?.[state.quiz.index];
        if (q?.type === 'short_answer') {
          state.quiz.results.push({ question: q.question, isCorrect: null, correctAnswer: q.model_answer });
          state.quiz.answered = true;
        } else {
          toast('Please answer the question first.', 'error');
          return;
        }
      }
      advanceQuiz();
    });

    // Quiz exit
    document.getElementById('quiz-exit-btn')?.addEventListener('click', () => {
      if (state.currentSet?.flashcards?.length) showFlashcards();
      else showView('home');
    });

    // Export modal
    document.getElementById('export-modal')?.addEventListener('click', e => {
      if (e.target.id === 'export-modal') closeExportModal();
    });
    document.getElementById('export-modal-close')?.addEventListener('click', closeExportModal);
    document.getElementById('export-json-btn')?.addEventListener('click', exportJSON);
    document.getElementById('export-html-btn')?.addEventListener('click', exportHTML);
    document.getElementById('export-copy-btn')?.addEventListener('click', copyJSON);

    // History: event delegation for load/delete buttons
    document.getElementById('history-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'load')   loadFromHistory(id);
      if (action === 'delete') deleteFromHistory(id);
    });

    // History clear all
    document.getElementById('history-clear-btn')?.addEventListener('click', async () => {
      try {
        await Storage.clearAll();
        toast('All history cleared.', 'success');
        showHistory();
      } catch {
        toast('Could not clear history.', 'error');
      }
    });

    // Back buttons
    document.getElementById('flashcards-back-btn')?.addEventListener('click', () => showView('home'));

    setupKeyboard();
  }

  /* ──────────────────────────────────────────────
     INITIALISE
  ────────────────────────────────────────────── */
  function updateDbBadge() {
    const el = document.getElementById('db-status');
    if (!el) return;
    const provider = Storage.getDbProvider();
    const labels = {
      supabase: '☁️ Supabase',
      file: '💾 Server DB',
      local: '📱 Local only',
      api: '☁️ Connected',
    };
    el.textContent = labels[provider] || provider;
    el.title = Storage.isUsingDatabase()
      ? 'Study sets are saved to the database'
      : 'Run npm start for database, or data stays in this browser';
  }

  async function init() {
    wireEvents();
    await Storage.checkApi();
    updateDbBadge();

    // Populate quick chips with known topics
    const chipsContainer = document.getElementById('quick-topics');
    if (chipsContainer && Engine.TOPICS) {
      chipsContainer.innerHTML = '';
      Engine.TOPICS.forEach(topic => {
        const chip = document.createElement('div');
        chip.className = 'quick-chip';
        chip.dataset.topic = topic;
        chip.textContent = topic;
        chip.addEventListener('click', () => {
          const input = document.getElementById('topic-input');
          if (input) { input.value = topic; input.focus(); }
        });
        chipsContainer.appendChild(chip);
      });
    }

    const topicCount = Engine.TOPICS?.length || 12;
    const countEl = document.getElementById('cat-count-all');
    if (countEl) countEl.textContent = String(topicCount);

    const durationEl = document.getElementById('featured-duration');
    const countSelect = document.getElementById('count-select');
    const updateFeaturedDuration = () => {
      const n = parseInt(countSelect?.value || '10', 10);
      if (durationEl) durationEl.textContent = `${Math.max(3, Math.ceil(n * 0.5))} min`;
    };
    countSelect?.addEventListener('change', updateFeaturedDuration);
    updateFeaturedDuration();

    showView('home');
    console.log('%cQuizly loaded', 'color:#FFB84D;font-size:1.1rem;font-weight:bold;');
  }

  return { init, showView, toast, startGenerate, startStudy, startQuiz, showHistory };

})();

// Boot the app once DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

/* ================================================
   FILE IMPORTER — PDF & Image upload
   Uses pdf.js (CDN) for PDFs and Tesseract.js for images
   ================================================ */
const FileImporter = (() => {

  // ── DOM refs ──────────────────────────────────
  let dropzone, fileInput, browseBtn, progressWrap,
      progressFill, progressLabel, previewWrap,
      previewTitle, previewText, generateBtn, clearBtn;

  let extractedText = '';

  // ── Helpers ───────────────────────────────────
  function showProgress(label, pct) {
    if (progressWrap) progressWrap.style.display = 'flex';
    if (progressFill) progressFill.style.width = `${Math.min(100, pct)}%`;
    if (progressLabel) progressLabel.textContent = label;
  }

  function hideProgress() {
    if (progressWrap) progressWrap.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
  }

  function showPreview(text, filename) {
    extractedText = text.trim();
    if (previewTitle) previewTitle.textContent = `📄 ${filename} — ${extractedText.split(/\s+/).length} words extracted`;
    if (previewText) previewText.textContent = extractedText.slice(0, 800) + (extractedText.length > 800 ? '…' : '');
    if (previewWrap) previewWrap.style.display = 'block';
    hideProgress();
  }

  function resetUpload() {
    extractedText = '';
    if (previewWrap) previewWrap.style.display = 'none';
    hideProgress();
    if (fileInput) fileInput.value = '';
  }

  // ── PDF extraction via pdf.js ─────────────────
  async function extractPDF(file) {
    if (!window.pdfjsLib) {
      App.toast('PDF.js library not loaded. Check your internet connection.', 'error');
      return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    showProgress('Reading PDF…', 10);
    const arrayBuffer = await file.arrayBuffer();
    showProgress('Parsing pages…', 30);

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
      showProgress(`Reading page ${i} of ${totalPages}…`, 30 + Math.round((i / totalPages) * 60));
    }

    showProgress('Done!', 100);

    if (!fullText.trim()) {
      App.toast('No text found in PDF. Try an image scan instead.', 'error');
      hideProgress();
      return;
    }

    showPreview(fullText, file.name);
  }

  // ── Image OCR via Tesseract.js ────────────────
  async function extractImage(file) {
    if (!window.Tesseract) {
      App.toast('Tesseract.js not loaded. Check your internet connection.', 'error');
      return;
    }

    showProgress('Loading OCR engine…', 5);

    try {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            showProgress(`OCR: ${Math.round((m.progress || 0) * 100)}%…`, 10 + Math.round((m.progress || 0) * 85));
          } else if (m.status) {
            const labels = {
              'loading tesseract core': 'Loading OCR engine…',
              'initializing tesseract': 'Initializing OCR…',
              'loading language traineddata': 'Loading language data…',
              'initializing api': 'Starting OCR…',
            };
            showProgress(labels[m.status] || m.status, 10);
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      showProgress('Done!', 100);

      if (!text.trim()) {
        App.toast('No text detected in image. Make sure the image contains readable text.', 'error');
        hideProgress();
        return;
      }

      showPreview(text, file.name);
    } catch (err) {
      console.error('OCR error:', err);
      App.toast('Image text extraction failed. Please try a clearer image.', 'error');
      hideProgress();
    }
  }

  // ── Route file to correct extractor ──────────
  async function handleFile(file) {
    if (!file) return;

    const name = file.name.toLowerCase();
    const isPDF = name.endsWith('.pdf');
    const isImage = /\.(png|jpg|jpeg|webp|gif|bmp)$/i.test(name);

    if (!isPDF && !isImage) {
      App.toast('Unsupported file type. Please upload a PDF or image.', 'error');
      return;
    }

    resetUpload();

    try {
      if (isPDF) {
        await extractPDF(file);
      } else {
        await extractImage(file);
      }
    } catch (err) {
      console.error('File import error:', err);
      App.toast('Failed to process file. Please try again.', 'error');
      hideProgress();
    }
  }

  // ── Generate quiz from extracted text ─────────
  function generateFromExtracted() {
    if (!extractedText) {
      App.toast('No text extracted yet.', 'error');
      return;
    }

    // Use the engine's "import:" prefix to trigger importFromText()
    // which parses raw sentences rather than topic-matching
    const topicInput = document.getElementById('topic-input');
    if (topicInput) {
      // Limit to 4000 chars for performance; engine's importFromText handles the rest
      const clipped = extractedText.slice(0, 4000);
      topicInput.value = 'import:' + clipped;
    }

    App.startGenerate();
  }

  // ── Event wiring ──────────────────────────────
  function init() {
    dropzone     = document.getElementById('upload-dropzone');
    fileInput    = document.getElementById('file-input');
    browseBtn    = document.getElementById('upload-browse-btn');
    progressWrap = document.getElementById('upload-progress');
    progressFill = document.getElementById('upload-progress-fill');
    progressLabel= document.getElementById('upload-progress-label');
    previewWrap  = document.getElementById('upload-preview');
    previewTitle = document.getElementById('upload-preview-title');
    previewText  = document.getElementById('upload-preview-text');
    generateBtn  = document.getElementById('upload-generate-btn');
    clearBtn     = document.getElementById('upload-preview-clear');

    if (!dropzone) return; // Upload UI not present

    // Click dropzone → open file picker
    dropzone.addEventListener('click', (e) => {
      if (e.target === browseBtn || browseBtn?.contains(e.target)) return; // handled below
      fileInput?.click();
    });

    // Browse button
    browseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput?.click();
    });

    // Keyboard access on dropzone
    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput?.click(); }
    });

    // File chosen via picker
    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) handleFile(file);
    });

    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    });

    // Generate from extracted text
    generateBtn?.addEventListener('click', generateFromExtracted);

    // Clear preview
    clearBtn?.addEventListener('click', resetUpload);
  }

  return { init };

})();

// Wire FileImporter after DOM ready (runs just after App.init)
document.addEventListener('DOMContentLoaded', () => FileImporter.init());

