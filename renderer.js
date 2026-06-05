/* ================================================
   RENDERER.JS — DOM Building Module
   Builds all UI components from data objects
   ================================================ */

const Renderer = (() => {

  /* ──────────────────────────────────────────────
     FLASHCARD GRID
  ────────────────────────────────────────────── */
  function renderFlashcardGrid(flashcards, containerId = 'cards-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!flashcards || flashcards.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:12px;">🃏</div>
          <div>No flashcards match this filter.</div>
        </div>`;
      return;
    }

    flashcards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'flip-card';
      el.dataset.id = card.id;
      el.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-tag">${(card.tags || ['General'])[0]}</div>
            <div class="card-question">${escapeHtml(card.front)}</div>
            <div class="card-footer">
              <span class="difficulty-badge ${card.difficulty}">${card.difficulty}</span>
              <span class="flip-hint">Click to flip ↻</span>
            </div>
          </div>
          <div class="flip-card-back">
            <div class="card-tag">Answer</div>
            <div class="card-answer">${escapeHtml(card.back)}</div>
            <div class="card-footer">
              <span class="difficulty-badge ${card.difficulty}">${card.type || 'recall'}</span>
              ${card.hint ? `<span class="flip-hint" title="${escapeHtml(card.hint)}">💡 Hint</span>` : ''}
            </div>
          </div>
        </div>`;
      el.addEventListener('click', () => el.classList.toggle('flipped'));
      container.appendChild(el);
    });
  }

  /* ──────────────────────────────────────────────
     STUDY MODE — Single Card
  ────────────────────────────────────────────── */
  function renderStudyCard(card, container, isFlipped = false) {
    container.innerHTML = `
      <div class="study-flip-card flip-card ${isFlipped ? 'flipped' : ''}" id="study-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="study-card-side-label">Question</div>
            <div class="study-card-main" id="study-front-text">${escapeHtml(card.front)}</div>
            ${card.hint ? `<div class="study-hint-box" id="study-hint-box">${escapeHtml(card.hint)}</div>` : ''}
          </div>
          <div class="flip-card-back">
            <div class="study-card-side-label">Answer</div>
            <div class="study-card-main">${escapeHtml(card.back)}</div>
          </div>
        </div>
      </div>`;
  }

  function renderStudyComplete(stats, container) {
    const total = stats.easy + stats.hard + stats.again;
    const pct = total > 0 ? Math.round((stats.easy / total) * 100) : 0;
    let emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    let message = pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good progress!' : 'Keep practicing!';
    container.innerHTML = `
      <div class="study-complete">
        <div class="study-complete-emoji">${emoji}</div>
        <h2 class="study-complete-title">${message}</h2>
        <p class="study-complete-sub">You reviewed all ${total} flashcards.</p>
        <div class="study-stats-row">
          <div class="study-stat-card">
            <div class="study-stat-value easy-c">${stats.easy}</div>
            <div class="study-stat-label">Easy ✓</div>
          </div>
          <div class="study-stat-card">
            <div class="study-stat-value hard-c">${stats.hard}</div>
            <div class="study-stat-label">Hard ⚡</div>
          </div>
          <div class="study-stat-card">
            <div class="study-stat-value again-c">${stats.again}</div>
            <div class="study-stat-label">Again ↩</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" id="study-restart-btn">↺ Study Again</button>
          <button class="btn btn-secondary" id="study-back-btn">← Back to Cards</button>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────
     QUIZ — Question Renderers
  ────────────────────────────────────────────── */
  const QUIZ_MASCOTS = ['🐝', '🦒', '🤖', '🦊', '🐧', '🦉', '🐙', '🦁'];

  function renderQuizQuestion(question, container) {
    container.innerHTML = '';

    const qText = question.statement || question.question || question.instruction || '';
    const mascotEl = document.getElementById('quiz-mascot');
    if (mascotEl) {
      const idx = Math.abs(hashStr(qText)) % QUIZ_MASCOTS.length;
      mascotEl.textContent = QUIZ_MASCOTS[idx];
    }

    const questionEl = document.createElement('p');
    questionEl.className = 'quiz-question-text';
    questionEl.textContent = qText;
    container.appendChild(questionEl);

    const answerArea = document.createElement('div');
    answerArea.id = 'quiz-answer-area';
    container.appendChild(answerArea);

    const explanationSlot = document.createElement('div');
    explanationSlot.id = 'quiz-explanation';
    container.appendChild(explanationSlot);

    switch (question.type) {
      case 'mcq':          renderMCQ(question, answerArea); break;
      case 'true_false':   renderTrueFalse(question, answerArea); break;
      case 'fill_blank':   renderFillBlank(question, answerArea); break;
      case 'short_answer': renderShortAnswer(question, answerArea); break;
      case 'matching':     renderMatching(question, answerArea); break;
      default:             renderMCQ(question, answerArea); break;
    }
  }

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return h;
  }

  function renderMCQ(q, container) {
    const div = document.createElement('div');
    div.className = 'mcq-grid';
    Object.entries(q.options).forEach(([letter, text]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mcq-grid-btn';
      btn.dataset.letter = letter;
      btn.textContent = text;
      btn.addEventListener('click', () => handleMCQSelect(q, letter, div));
      div.appendChild(btn);
    });
    container.appendChild(div);
  }

  function handleMCQSelect(q, chosen, container) {
    if (container.dataset.answered) return;
    container.dataset.answered = '1';

    const buttons = container.querySelectorAll('.mcq-grid-btn');
    buttons.forEach(btn => {
      btn.disabled = true;
      const letter = btn.dataset.letter;
      if (letter === chosen) btn.classList.add('selected');
      if (letter === q.answer) btn.classList.add('reveal-correct');
      if (letter === chosen && chosen !== q.answer) {
        btn.classList.remove('selected');
        btn.classList.add('incorrect');
      }
      if (letter === chosen && chosen === q.answer) {
        btn.classList.remove('reveal-correct');
        btn.classList.add('correct');
      }
    });

    const isCorrect = chosen === q.answer;
    showExplanation(q.explanation, isCorrect);
    markAnswered(isCorrect, q.answer ? `${q.answer}: ${q.options[q.answer]}` : '');
  }

  function renderTrueFalse(q, container) {
    const div = document.createElement('div');
    div.className = 'tf-options';
    [true, false].forEach(val => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tf-btn';
      btn.textContent = val ? '✓ True' : '✗ False';
      btn.addEventListener('click', () => handleTFSelect(q, val, div));
      div.appendChild(btn);
    });
    container.appendChild(div);
  }

  function handleTFSelect(q, chosen, container) {
    if (container.dataset.answered) return;
    container.dataset.answered = '1';

    const [trueBtn, falseBtn] = container.querySelectorAll('.tf-btn');
    trueBtn.disabled = falseBtn.disabled = true;
    const correct = q.answer;
    const chosenBtn = chosen ? trueBtn : falseBtn;
    const correctBtn = correct ? trueBtn : falseBtn;

    if (chosen === correct) {
      chosenBtn.classList.add('correct');
    } else {
      chosenBtn.classList.add('incorrect');
      correctBtn.classList.add('reveal-correct');
    }

    showExplanation(q.explanation, chosen === correct);
    markAnswered(chosen === correct, `${correct ? 'True' : 'False'}`);
  }

  function renderFillBlank(q, container) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'fill-blank-input';
    inp.placeholder = 'Type your answer...';
    inp.autocomplete = 'off';
    container.appendChild(inp);

    const btn = document.createElement('button');
    btn.className = 'submit-btn';
    btn.textContent = 'Submit Answer';
    btn.id = 'quiz-submit-btn';
    container.appendChild(btn);

    const check = () => {
      if (btn.dataset.done) return;
      btn.dataset.done = '1';
      inp.disabled = true;
      btn.disabled = true;
      const userAnswer = inp.value.trim().toLowerCase();
      const acceptable = [q.answer.toLowerCase(), ...(q.acceptable_answers || []).map(a => a.toLowerCase())];
      const isCorrect = acceptable.includes(userAnswer);
      inp.classList.add(isCorrect ? 'correct' : 'incorrect');
      showExplanation(q.explanation, isCorrect);
      markAnswered(isCorrect, q.answer);
    };

    btn.addEventListener('click', check);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }

  function renderShortAnswer(q, container) {
    const ta = document.createElement('textarea');
    ta.className = 'short-answer-textarea';
    ta.placeholder = 'Write your answer here (1–3 sentences)...';
    container.appendChild(ta);

    const btn = document.createElement('button');
    btn.className = 'submit-btn';
    btn.textContent = 'Reveal Model Answer';
    btn.id = 'quiz-submit-btn';
    container.appendChild(btn);

    btn.addEventListener('click', () => {
      if (btn.dataset.done) return;
      btn.dataset.done = '1';
      ta.disabled = true;
      btn.disabled = true;
      const kpHtml = (q.key_points || []).map(kp => `<li>${escapeHtml(kp)}</li>`).join('');
      const box = document.createElement('div');
      box.className = 'model-answer-box';
      box.innerHTML = `
        <strong>Model Answer</strong>
        ${escapeHtml(q.model_answer)}
        ${kpHtml ? `<ul class="key-points" style="margin-top:8px;">${kpHtml}</ul>` : ''}`;
      container.appendChild(box);
      markAnswered(null, q.model_answer); // null = self-assessed
    });
  }

  function renderMatching(q, container) {
    const pairs = Engine.shuffle([...q.pairs]);
    const terms = pairs.map(p => p.term);
    const defs  = Engine.shuffle(pairs.map(p => p.match));

    const grid = document.createElement('div');
    grid.className = 'matching-grid';
    grid.innerHTML = `
      <div>
        <div class="matching-col-label">Terms</div>
        <div id="matching-terms"></div>
      </div>
      <div>
        <div class="matching-col-label">Definitions</div>
        <div id="matching-defs"></div>
      </div>`;
    container.appendChild(grid);

    const correct = {};
    pairs.forEach(p => { correct[p.term] = p.match; });

    let selectedTerm = null;
    let matchedCount = 0;
    const totalPairs = pairs.length;

    const termsContainer = grid.querySelector('#matching-terms');
    const defsContainer  = grid.querySelector('#matching-defs');

    terms.forEach(term => {
      const el = document.createElement('div');
      el.className = 'matching-item';
      el.dataset.term = term;
      el.textContent = term;
      el.addEventListener('click', () => {
        if (el.classList.contains('matched')) return;
        if (selectedTerm === term) {
          el.classList.remove('selected');
          selectedTerm = null;
          return;
        }
        termsContainer.querySelectorAll('.matching-item').forEach(t => t.classList.remove('selected'));
        el.classList.add('selected');
        selectedTerm = term;
      });
      termsContainer.appendChild(el);
    });

    defs.forEach(def => {
      const el = document.createElement('div');
      el.className = 'matching-item';
      el.dataset.def = def;
      el.textContent = def;
      el.addEventListener('click', () => {
        if (!selectedTerm) return;
        if (el.classList.contains('matched')) return;
        const isCorrect = correct[selectedTerm] === def;
        if (isCorrect) {
          el.classList.add('matched');
          const termEl = termsContainer.querySelector(`[data-term="${CSS.escape(selectedTerm)}"]`);
          if (termEl) termEl.classList.add('matched');
          matchedCount++;
          if (matchedCount === totalPairs) {
            showExplanation('All pairs matched correctly! Great job.', true);
            markAnswered(true, 'All pairs matched');
          }
        } else {
          el.classList.add('wrong');
          setTimeout(() => el.classList.remove('wrong'), 400);
          const termEl = termsContainer.querySelector(`[data-term="${CSS.escape(selectedTerm)}"]`);
          if (termEl) { termEl.classList.add('wrong'); setTimeout(() => termEl.classList.remove('wrong'), 400); }
        }
        termsContainer.querySelectorAll('.matching-item').forEach(t => t.classList.remove('selected'));
        selectedTerm = null;
      });
      defsContainer.appendChild(el);
    });
  }

  /* ──────────────────────────────────────────────
     QUIZ HELPERS
  ────────────────────────────────────────────── */
  function showExplanation(text, isCorrect) {
    const box = document.getElementById('quiz-explanation');
    if (!box || !text) return;
    const icon = isCorrect === null ? 'ℹ️' : isCorrect ? '✅' : '❌';
    box.innerHTML = `
      <div class="explanation-box">
        <div class="expl-label">${icon} ${isCorrect === null ? 'Model Answer Revealed' : isCorrect ? 'Correct!' : 'Incorrect'}</div>
        ${escapeHtml(text)}
      </div>`;
  }

  // Dispatcher: other modules listen for this custom event
  function markAnswered(isCorrect, correctAnswer) {
    document.dispatchEvent(new CustomEvent('quiz:answered', {
      detail: { isCorrect, correctAnswer }
    }));
  }

  /* ──────────────────────────────────────────────
     QUIZ RESULTS
  ────────────────────────────────────────────── */
  function renderResults(scoreData, container) {
    const { correct, total, results } = scoreData;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const circumference = 2 * Math.PI * 72; // r=72
    const dashOffset = circumference - (pct / 100) * circumference;

    let grade = '🥇 Outstanding!';
    if (pct < 80) grade = '🥈 Well Done!';
    if (pct < 60) grade = '📚 Good Effort!';
    if (pct < 40) grade = '💪 Keep Practicing!';

    const reviewItems = (results || []).map(r => `
      <div class="review-item">
        <div class="review-icon ${r.isCorrect ? 'ok' : 'err'}">${r.isCorrect ? '✓' : '✗'}</div>
        <div class="review-item-body">
          <div class="review-q">${escapeHtml(r.question)}</div>
          <div class="review-a">
            ${r.isCorrect === null
              ? '<span style="color:var(--cyan)">Self-assessed</span>'
              : r.isCorrect
                ? `<span class="ok">Correct</span>`
                : `<span class="err">Your answer</span> → <span class="ok">Correct: ${escapeHtml(String(r.correctAnswer || ''))}</span>`
            }
          </div>
        </div>
      </div>`).join('');

    container.innerHTML = `
      <div class="results-ring-wrap">
        <svg viewBox="0 0 160 160">
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FFB84D"/>
              <stop offset="100%" stop-color="#1A1A1A"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="80" cy="80" r="72"/>
          <circle class="ring-fill" cx="80" cy="80" r="72"
            stroke="url(#sg)"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            id="ring-fill-el"/>
        </svg>
        <div class="ring-text">
          <div class="ring-pct" id="ring-pct-text">0%</div>
          <div class="ring-label">Score</div>
        </div>
      </div>

      <h2 class="results-title">${grade}</h2>
      <p class="results-sub">You answered ${correct} out of ${total} questions correctly.</p>

      <div class="results-stats">
        <div class="result-stat">
          <div class="result-stat-val c-ok">${correct}</div>
          <div class="result-stat-label">Correct</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-val c-err">${total - correct}</div>
          <div class="result-stat-label">Incorrect</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-val c-all">${total}</div>
          <div class="result-stat-label">Total</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-val" style="color:var(--gold-light)">${pct}%</div>
          <div class="result-stat-label">Accuracy</div>
        </div>
      </div>

      ${reviewItems ? `
        <div class="review-section">
          <div class="review-section-title">Question Review</div>
          ${reviewItems}
        </div>` : ''}

      <div class="results-actions">
        <button class="btn btn-primary" id="results-retake-btn">↺ Retake Quiz</button>
        <button class="btn btn-secondary" id="results-flashcards-btn">🃏 View Flashcards</button>
        <button class="btn btn-gold" id="results-export-btn">📤 Export</button>
        <button class="btn btn-ghost" id="results-home-btn">🏠 New Session</button>
      </div>`;

    // Animate the ring after a short delay
    setTimeout(() => {
      const el = document.getElementById('ring-fill-el');
      const txt = document.getElementById('ring-pct-text');
      if (el) el.style.strokeDashoffset = dashOffset;
      if (txt) animateNumber(txt, 0, pct, 1200, v => v + '%');
    }, 100);
  }

  function animateNumber(el, from, to, duration, formatter) {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatter(Math.round(from + (to - from) * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ──────────────────────────────────────────────
     HISTORY
  ────────────────────────────────────────────── */
  function renderHistory(sets, container) {
    if (!container) return;
    if (!sets || sets.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <div class="history-empty-icon">📂</div>
          <div class="history-empty-text">No saved sets yet. Generate your first flashcard set to see it here!</div>
        </div>`;
      return;
    }

    container.innerHTML = '';
    sets.forEach(set => {
      const date = new Date(parseInt(set.id, 36) || Date.now());
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const fcCount = set.flashcards ? set.flashcards.length : 0;
      const qCount  = set.quiz ? set.quiz.total || 0 : 0;

      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <div class="history-card-title" title="${escapeHtml(set.topic || 'Untitled')}">${escapeHtml(set.topic || 'Untitled')}</div>
        <div class="history-card-meta">${dateStr} · ${fcCount} cards · ${qCount} questions</div>
        <div class="history-card-chips">
          ${fcCount ? `<span class="history-chip">🃏 ${fcCount} Flashcards</span>` : ''}
          ${qCount  ? `<span class="history-chip">📝 ${qCount} Questions</span>` : ''}
        </div>
        <div class="history-card-actions">
          <button class="btn btn-primary btn-sm" data-action="load" data-id="${set.id}">Load</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-id="${set.id}">Delete</button>
        </div>`;
      container.appendChild(card);
    });
  }

  /* ──────────────────────────────────────────────
     UTILITY
  ────────────────────────────────────────────── */
  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ──────────────────────────────────────────────
     PUBLIC API
  ────────────────────────────────────────────── */
  return {
    renderFlashcardGrid,
    renderStudyCard,
    renderStudyComplete,
    renderQuizQuestion,
    renderResults,
    renderHistory,
    showExplanation,
    escapeHtml
  };

})();
