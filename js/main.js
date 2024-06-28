document.addEventListener("DOMContentLoaded", () => {
    const minChar = 2;
    const isAlertListPage = window.location.pathname.includes('/alert-list/');
    const isBasedGamesPage = window.location.pathname.includes('/based-games/');

    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            
            const alertList = data.filter(item => item.wokeness > 0);
            const basedList = data.filter(item => item.wokeness == 0);

            const fuse = new Fuse(alertList, {
                keys: ['title', 'date', 'wokeness'],
                threshold: 0.3,
                minMatchCharLength: minChar
            });

            const fuseBased = new Fuse(basedList, {
                keys: ['title', 'date', 'wokeness'],
                threshold: 0.3,
                minMatchCharLength: minChar 
            });

            const searchInput = document.getElementById('search');
            const searchResults = document.querySelector('.search-results');
            const miniSearchInput = document.getElementById('mini-search');
            const gameList = document.querySelector('.game-list-games');
            const filter = document.getElementById('filter');

            const createGameItemHTML = item =>
                `<a class="game" href="${item.relPermalink}">
                <div class="game-title">
                    <h3>${item.title}</h3>
                    <div class="wokimeter w-${getWokenessLevel(item.wokeness)}" title="Wokeness Level: ${item.wokeness}"></div>
                </div>
                <div class="game-image" style="background-image:url('../images/${item.cover}')"></div>
                </a>`;

            const updateSearchResults = () => {
                const query = searchInput.value.trim();
                if (!query) {
                    searchResults.style.display = 'none';
                    searchResults.innerHTML = '';
                    return;
                }

                const results = fuse.search(query);
                searchResults.innerHTML = results.map(result => 
                    `<a href="/${result.item.origin}/${result.item.title.toLowerCase().replace(/\s+/g, '-')}">${result.item.title}</a>`
                ).join('');

                searchResults.style.display = results.length ? 'block' : 'none';
            };

            const updateMiniSearchResults = () => {
                const query = miniSearchInput.value.trim();
                if (query.length < minChar) {
                    updateList();
                    console.log('not enough characters')
                    return;
                }

                if (isAlertListPage) {
                    const results = fuse.search(query);
                    gameList.innerHTML = results.map(result => createGameItemHTML(result.item)).join('');
                }

                if (isBasedGamesPage) {
                    const results = fuseBased.search(query);
                    gameList.innerHTML = results.map(result => createGameItemHTML(result.item)).join('');
                }
            };

            const updateList = () => {
                if (isAlertListPage) {
                    const query = filter.value.trim();
                    const filteredData = data.filter(item => 
                        query === 'light' ? item.wokeness >= 1 && item.wokeness < 25 :
                        query === 'medium' ? item.wokeness >= 25 && item.wokeness < 50 :
                        query === 'high' ? item.wokeness >= 50 && item.wokeness < 75 :
                        query === 'propaganda' ? item.wokeness > 75 : 
                        item.wokeness
                    );
                    gameList.innerHTML = filteredData.map(item => createGameItemHTML(item)).join('');
                    return;
                }

                gameList.innerHTML = basedList.map(item => createGameItemHTML(item)).join('');
            };

            searchInput?.addEventListener('input', updateSearchResults);
            miniSearchInput?.addEventListener('input', updateMiniSearchResults);
            filter?.addEventListener('input', updateList);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

const getWokenessLevel = wokeness =>
    wokeness === 0 ? 'based' :
    wokeness < 25 ? 'light' :
    wokeness < 50 ? 'medium' :
    wokeness < 75 ? 'high' : 'propaganda';