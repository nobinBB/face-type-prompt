// 選択された単語を管理するオブジェクト
const selectedWords = {};

// YAMLファイルの読み込み
async function loadYaml() {
    try {
        const response = await fetch('./assets/data/type-of-girl.yaml');
        const text = await response.text();
        const data = jsyaml.load(text);
        return data['type-of-girl－女性のタイプ'] || {};
    } catch (error) {
        console.error('YAMLの読み込みに失敗しました:', error);
        return {};
    }
}

// カテゴリを表示する
async function displayCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categories = await loadYaml();

    for (const [category, items] of Object.entries(categories)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.dataset.category = category;

        const heading = document.createElement('h2');
        heading.textContent = category;
        categoryDiv.appendChild(heading);

        // 画像を表示するカテゴリを指定
        const imageCategories = {
            '髪型': './assets/img/hair-style/',
            '眉毛のタイプ': './assets/img/eyebrows/',
            'eyes-目のタイプ': './assets/img/eye-type/',
            '髪の色': './assets/img/hair-color/',
            'pupils-瞳のタイプ': './assets/img/pupils/',
            '瞳のタイプ': './assets/img/eye-type/',
            '目の色': './assets/img/eye-color/',
            '鼻のタイプ': './assets/img/nose/',
            '口のタイプ': './assets/img/mouth/',
            'face-顔全体のタイプ': './assets/img/face-type/',
        };

        if (imageCategories[category]) {
            // 画像とボタンを表示
            const list = document.createElement('div');
            list.className = 'image-list';

            items.forEach(item => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.dataset.word = item; // 単語を保存

                const img = document.createElement('img');
                img.className = 'image';
                img.src = `${imageCategories[category]}${item}.png`;
                img.alt = item;

                const button = document.createElement('button');
                button.className = 'button';
                button.textContent = item;

                // .image-item全体にクリックイベントを設定
                imageItem.addEventListener('click', () => {
                    selectWord(category, item, imageItem);
                });

                imageItem.appendChild(img);
                imageItem.appendChild(button);
                list.appendChild(imageItem);
            });

            categoryDiv.appendChild(list);
        } else {
            // その他のカテゴリ: 横スクロール可能なボタンリスト
            const list = document.createElement('div');
            list.className = 'scroll-list';

            items.forEach(item => {
                const button = document.createElement('button');
                button.className = 'button';
                button.textContent = item;
                button.onclick = () => selectWord(category, item, button);
                list.appendChild(button);
            });

            categoryDiv.appendChild(list);
        }

        categoriesContainer.appendChild(categoryDiv);
    }
}

// 単語を選択する関数（画像ありの場合も対応）
function selectWord(category, word, element) {
    const categoryDiv = element.closest('.category');
    const selectedElements = categoryDiv.querySelectorAll('.selected');

    // 以前の選択を解除
    selectedElements.forEach(el => el.classList.remove('selected'));

    // クリックされた要素に selected クラスを追加
    element.classList.add('selected');
    selectedWords[category] = word; // 選択された単語を保存
}

// Generateボタンの処理
document.getElementById('generateBtn').addEventListener('click', () => {
    const outputText = Object.values(selectedWords)
        .filter(word => word)
        .join('\nBREAK\n');
    document.getElementById('output').textContent = outputText;
});

// Copyボタンの処理
document.querySelector('.copy-btn').addEventListener('click', () => {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
    });
});

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
});