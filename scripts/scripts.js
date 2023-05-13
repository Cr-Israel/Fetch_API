const url = "https://jsonplaceholder.typicode.com/posts";

// index.html
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

// post.html
const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// Get ID from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get('id');

// Get All Posts
async function getAllPosts() {
    const response = await fetch(url);
    console.log(response);

    const data = await response.json();
    console.log(data);

    loadingElement.classList.add('hide');

    data.map((post) => {
        const div = document.createElement('div');
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = 'Ler';
        link.setAttribute('href', `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    });
};

// Get Individual Post
async function getPost(id) {
    // Terei uma constante que vai trabalhar com 2 request assíncronos
    // E como recebe 2 coisas, vou fazer uma desestruturação de Array.
    // Ele precisam se feitos em paralelos, pois assim eu consigo deixar meu software mais performatico.

    // Quando tenho 2 requests assíncronos e tenho que executar ao mesmo tempo, eu faço uma promessa
    const [responsePost, responseComments] = await Promise.all([
        // Eu faço um Array e coloco aqui todos os requests que quero executar, inclusive os assíncronos.
        fetch(`${url}/${id}`), // URL que vou acessar. Aqui vai buscar os dados do post individual.
        fetch(`${url}/${id}/comments`) // Ele pega os comentários do Post
    ]);
    // Assim, eu executo as minhas 2 requests ao mesmo tempo, economizando um pouco de mémoria do servidor 
    // e também o trafégo de rede. Executo os 2 requests ao mesmo tempo, sendo mais performatico na aplicação.
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();
    // Agora eu tenho 2 Arrays de objetos, 1 para post individual e outro para comentários

    // Tiro o loading
    loadingElement.classList.add('hide');
    // E vou aparecer com meu container de comentários
    postPage.classList.remove('hide');

    // Agora vou preencher as divs com os conteúdos que foram pegas nas requests
    const title = document.createElement('h1');
    const body = document.createElement('p');

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    // Trazer os comentários
    dataComments.map((comment) => {
        createComment(comment)
    });
};

function createComment(comment) {
    const div = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);
};

// Post a Comment
async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json"
        },
    });

    const data = await response.json();

    // Crio os comentários
    createComment(data);
};

if (!postId) {
    getAllPosts();
} else {
    getPost(postId);

    // Add Event to Comment Form
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Variável de comentário
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };

        // Transformo em Texto
        comment = JSON.stringify(comment);
        postComment(comment);
    });
};