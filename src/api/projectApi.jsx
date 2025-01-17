// src/api/projectApi.jsx

const BASE_URL = 'http://127.0.0.1:8080/api/v1';

/** Кодируем Basic Auth: "username:password" -> base64 */
function encodeBasicAuth(username, password) {
    return btoa(`${username}:${password}`);
}

/**
 * POST /api/v1/auth/login
 * Сервер должен вернуть 200 при успехе, 401 при неверных данных
 */
export async function loginUserApi(username, password) {
    const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // В шапку передаём Basic Auth
            Authorization: 'Basic ' + encodeBasicAuth(username, password),
        },
    });

    // При 401 — считаем, что логин не удался: возвращаем false
    if (resp.status === 401) {
        return false;
    }

    if (!resp.ok) {
        // Любой другой ошибочный код (4xx, 5xx) — бросаем исключение
        throw new Error('Ошибка при логине: ' + resp.status);
    }

    // При успехе (200) может не быть тела, поэтому возвращаем true
    return true;
}

/**
 * POST /api/v1/auth/register
 * request body:
 *   {
 *     "username": "...",
 *     "password": "...",
 *     "display_name": "..." (необязательно)
 *   }
 * response body:
 *   {
 *     "id": 2,
 *     "username": "...",
 *     "display_name": "...",
 *     ...
 *   }
 */
export async function registerUserApi(username, password, displayName) {
    const body = { username, password };
    if (displayName) {
        body.display_name = displayName;
    }

    const resp = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        throw new Error(`Ошибка регистрации: [${resp.status}]`);
    }

    // Предположим, что сервер возвращает JSON с данными нового пользователя:
    return await resp.json();
}

/**
 * GET /api/v1/users/:username
 * Возвращает карточку пользователя в формате JSON:
 * {
 *   "id": ...,
 *   "username": ...,
 *   "display_name": ...,
 *   "created_on": ...,
 *   "projects": [...]
 * }
 */
export async function getUserInfoApi(currentUser, currentPass, username) {
    const resp = await fetch(`${BASE_URL}/users/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при получении пользователя: [${resp.status}]`);
    }

    return await resp.json();
}

/**
 * PATCH /api/v1/users/:username
 * Обновляет данные пользователя (например, display_name)
 * request body: { "display_name": "Новое Имя" }
 * response body: обновлённый пользователь
 */
export async function updateUserApi(currentUser, currentPass, userToUpdate, body) {
    const resp = await fetch(`${BASE_URL}/users/${userToUpdate}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при обновлении пользователя: [${resp.status}]`);
    }

    return await resp.json();
}

/**
 * DELETE /api/v1/users/:username
 * Удаляет пользователя
 * Ответ может быть 204 (без тела) или 200 (с телом)
 */
export async function deleteUserApi(currentUser, currentPass, userToDelete) {
    const resp = await fetch(`${BASE_URL}/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при удалении пользователя: [${resp.status}]`);
    }

    // Если сервер возвращает статус 204 без тела,
    // можно вернуть true или любое подтверждение:
    return true;
}

/**
 * GET /api/v1/projects
 * Получить список проектов (доступен без логина, если так настроено)
 * или с логином (если требуется).
 * Для примера оставим Basic Auth, если каталог всё же закрытый.
 * Если каталог публичный, уберите Authorization.
 */
export async function getAllProjectsApi() {
    const resp = await fetch(`${BASE_URL}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при получении projects: [${resp.status}]`);
    }

    // Предположим, что сервер возвращает массив JSON
    return await resp.json();
}

/**
 * POST /api/v1/projects
 * request body:
 *   {
 *     "name": "...",
 *     "title": "...",
 *     "description": "...",
 *     ...
 *   }
 * response body: созданный проект
 */
export async function createProjectApi(username, password, body) {
    const resp = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при создании проекта: [${resp.status}]`);
    }

    return await resp.json();
}

/**
 * GET /api/v1/projects/:username/:projectName
 * Возвращает JSON вида:
 * {
 *   "id": ...,
 *   "title": "...",
 *   "name": "...",
 *   "author_username": "...",
 *   ...
 * }
 */
export async function getProjectByNameApi(currentUser, currentPass, authorUsername, projectName) {
    const resp = await fetch(`${BASE_URL}/projects/${authorUsername}/${projectName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при получении проекта: [${resp.status}]`);
    }

    return await resp.json();
}

/**
 * PATCH /api/v1/projects/:username/:projectName
 * Обновляет существующий проект (title, description и т.п.)
 * response: обновлённый проект
 */
export async function updateProjectApi(currentUser, currentPass, authorUsername, projectName, body) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}`;
    const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при обновлении проекта: [${resp.status}]`);
    }
    return await resp.json();
}

/**
 * DELETE /api/v1/projects/:username/:projectName
 */
export async function deleteProjectApi(currentUser, currentPass, authorUsername, projectName) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}`;
    const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при удалении проекта: [${resp.status}]`);
    }

    // Предположим, что сервер отвечает 204 или 200 без содержимого
    return true;
}
