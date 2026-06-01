document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const filterButtons = document.querySelectorAll('.filter-btn');
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerCap = document.getElementById('viewerCap');
  const closeBtn = document.querySelector('.close-btn');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  let activePool = [...cards];
  let activeIndex = 0;
  // Handle category filters
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const targetCategory = e.currentTarget.getAttribute('data-target');

      cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Update active pool so lightbox skips hidden items
      activePool = cards.filter(card => !card.classList.contains('hidden'));
    });
  });

  const syncViewerContent = (index) => {
    if (!activePool[index]) return;
    
    const targetCard = activePool[index];
    const originalImg = targetCard.querySelector('img');

    viewerImg.src = originalImg.src;
    viewerImg.alt = originalImg.alt || "Gallery Image";
    viewerCap.textContent = targetCard.querySelector('.overlay h3').textContent;
    activeIndex = index;
  };
  // Open lightbox on card click using event delegation
  document.getElementById('gallery').addEventListener('click', (e) => {
    const chosenCard = e.target.closest('.card');
    if (!chosenCard || chosenCard.classList.contains('hidden')) return;

    const currentPosition = activePool.indexOf(chosenCard);
    syncViewerContent(currentPosition);
    viewer.showModal();
  });
  // Slider controls (-1 for left, 1 for right)
  const shiftImage = (step) => {
    if (activePool.length <= 1) return;
    
    let pointer = activeIndex + step;
    
    if (pointer >= activePool.length) pointer = 0;
    if (pointer < 0) pointer = activePool.length - 1;
    
    syncViewerContent(pointer);
  };

  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); shiftImage(1); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); shiftImage(-1); });
  closeBtn.addEventListener('click', () => viewer.close());
  // Close when clicking outside content area
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) viewer.close();
  });
  // Keyboard navigation hotkeys
  window.addEventListener('keydown', (e) => {
    if (!viewer.open) return;
    if (e.key === 'ArrowRight') shiftImage(1);
    if (e.key === 'ArrowLeft') shiftImage(-1);
  });
});
