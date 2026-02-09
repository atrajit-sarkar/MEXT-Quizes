// Practice Sections Renderer
// Generates practice card HTML from section data files into the portal grid.
// Must be loaded AFTER all section JS files (vocabulary.js, grammar.js, etc.)

(function () {
    const grid = document.getElementById('practiceGrid');
    if (!grid || !window.practiceSections) return;

    let html = '';
    window.practiceSections.forEach(section => {
        html += `
            <div class="practice-group">
                <div class="practice-header">
                    <h3>${section.title}</h3>
                    <span class="practice-tag">${section.tag}</span>
                </div>
                <div class="practice-list">`;

        section.cards.forEach(card => {
            html += `
                    <div class="practice-card" data-practice-id="${card.id}">
                        <div>
                            <h4>${card.title}</h4>
                            <p>${card.meta}</p>
                        </div>
                        <a class="btn btn-outline" href="practice/index.html?set=${card.id}" onclick="startPractice('${card.id}'); return false;">Start</a>
                    </div>`;
        });

        html += `
                </div>
            </div>`;
    });

    grid.innerHTML = html;
})();
