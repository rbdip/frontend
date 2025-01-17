// src/api/projectApi.jsx

const BASE_URL = 'http://127.0.0.1:8080/api/v1';

function encodeBasicAuth(username, password) {
    return btoa(`${username}:${password}`);
}

/** Проверка логина/пароля (если есть /whoami) */
export async function checkCredentials({ username, password }) {
    const resp = await fetch(`${BASE_URL}/whoami`, {
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
        },
    });
    if (!resp.ok) {
        throw new Error('Неверный логин или пароль');
    }
    return await resp.json();
}

/** Получить список проектов */
export async function getAllProjects({ username, password }) {
    const resp = await fetch(`${BASE_URL}/projects`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
            'Content-Type': 'application/json',
        },
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Ошибка при получении списка проектов: [${resp.status}] ${text}`);
    }
    return await resp.json();
}

/** Получить один проект */
export async function getProject({ username, password }, authorUsername, projectName) {
    const resp = await fetch(`${BASE_URL}/projects/${authorUsername}/${projectName}`, {
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
            'Content-Type': 'application/json',
        },
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Ошибка при запросе проекта: [${resp.status}] ${text}`);
    }
    return await resp.json();
}

/** Создать проект */
export async function createProject({ username, password }, body) {
    const resp = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Ошибка при создании проекта: [${resp.status}] ${text}`);
    }
    return await resp.json();
}
