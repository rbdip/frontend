// src/api/projectApi.jsx

const BASE_URL = 'http://127.0.0.1:8080/api/v1';

/** Кодируем Basic Auth: "username:password" -> base64 */
function encodeBasicAuth(username, password) {
    return btoa(`${username}:${password}`);
}

/**
 * POST /api/v1/auth/login
 * Возвращает true, если статус 200 (логин успешен).
 * Если 401 — возвращаем false (неверные данные).
 */
export async function loginUserApi(username, password) {
    const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + encodeBasicAuth(username, password),
        },
    });

    if (resp.status === 401) {
        return false; // неверный логин/пароль
    }
    if (!resp.ok) {
        throw new Error('Ошибка при логине: ' + resp.status);
    }

    return true;
}

/**
 * POST /api/v1/auth/register
 * Пример request body: { "username": "...", "password": "...", "display_name": "..." }
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

    return await resp.json();
}

/**
 * GET /api/v1/users/:username
 * Пример response body:
 * {
 *   "id": 2,
 *   "username": "admin2",
 *   "display_name": null,
 *   "created_on": "2025-01-17T17:42:20.333503",
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
 * request body: { "display_name": "Новое Имя" }
 * response body: обновлённый пользователь (JSON)
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

/** DELETE /api/v1/users/:username */
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
    // обычно сервер ответит 204 или 200
    return true;
}

/**
 * GET /api/v1/projects
 * Возвращает массив проектов. Пример (упрощённо):
 * [
 *   {
 *     "id": 2,
 *     "title": "Мой проект",
 *     "name": "rbdip4",
 *     "author_username": "admin",
 *     ...
 *   },
 *   ...
 * ]
 */
export async function getAllProjectsApi({ limit, page, query }) {
    const params = new URLSearchParams();
    if (limit != null) params.set('limit', limit);
    if (page != null) params.set('page', page);
    if (query) params.set('query', query);

    const url = `${BASE_URL}/projects?${params.toString()}`;
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: 'Basic ' + btoa(`${username}:${password}`),
        },
    });

    if (!resp.ok) {
        throw new Error(`Ошибка при получении проектов: [${resp.status}]`);
    }

    return await resp.json();
}

/**
 * POST /api/v1/projects
 * Request body пример:
 * {
 *   "name": "...",
 *   "title": "...",
 *   "description": "...",
 *   ...
 * }
 * Response body: созданный проект (JSON)
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
 * Пример ответа:
 * {
 *   "id": 4,
 *   "title": "Новое название",
 *   "name": "rbdip007",
 *   "author_username": "admin",
 *   "author_display_name": null,
 *   "created_on": "2025-01-17",
 *   "updated_on": "2025-01-17",
 *   "description": "a description bro",
 *   "display_version": "NewVersionName-1.1.1",
 *   "versions": [
 *       {
 *           "id": 4,
 *           "display_name": "NewVersionName-1.1.1",
 *           "display_order": 1
 *       }
 *   ]
 * }
 */
export async function getProjectByNameApi(
    currentUser, currentPass,
    authorUsername, projectName,
    versionQuery = ''
) {
    let url = `${BASE_URL}/projects/${authorUsername}/${projectName}`;
    if (versionQuery) {
        // Добавляем ?version=...
        url += `?version=${encodeURIComponent(versionQuery)}`;
    }
    const resp = await fetch(url, {
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`),
        },
    });
    if (!resp.ok) {
        throw new Error(`Ошибка GET проекта: ${resp.status}`);
    }
    return await resp.json();
}

/**
 * PATCH /api/v1/projects/:username/:projectName
 * request body (опциональные поля, но хотя бы один):
 * {
 *   "title": "Новое название",
 *   "project_name": "rbdip007",
 *   "version_name": "NewVersionName-1.1.1",
 *   "description": "a description bro"
 * }
 * response body (обновлённый проект):
 * {
 *   ...
 *   "display_version": "NewVersionName-1.1.1",
 *   "versions": [...]
 * }
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

    // Возвращаем обновлённый проект
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
    return true;
}

// POST /api/v1/projects/:author/:projectName/versions
export async function createProjectVersionApi(
    currentUser, currentPass,
    authorUsername, projectName,
    body
) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}/versions`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при добавлении версии: ${resp.status}`);
    }
    return await resp.json(); // Возвращает обновлённый проект
}

// PATCH /api/v1/projects/:author/:projectName/versions/:versionName
export async function updateProjectVersionApi(
    currentUser, currentPass,
    authorUsername, projectName,
    oldVersionName,
    body
) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}/versions/${encodeURIComponent(oldVersionName)}`;
    const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при обновлении версии: ${resp.status}`);
    }
    return await resp.json();
}

// DELETE /api/v1/projects/:author/:projectName/versions/:versionName
export async function deleteProjectVersionApi(
    currentUser, currentPass,
    authorUsername, projectName,
    versionName
) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}/versions/${encodeURIComponent(versionName)}`;
    const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`),
        },
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при удалении версии: ${resp.status}`);
    }
    return true;
}

export async function setFavouriteApi(currentUser, currentPass, authorUsername, projectName) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}/favourites`;
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`)
        }
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при добавлении в избранное: ${resp.status}`);
    }
    // Если resp.status = 204, нет тела
    if (resp.status === 204) return true;
    // Если 200 => JSON
    return await resp.json();
}

export async function unsetFavouriteApi(currentUser, currentPass, authorUsername, projectName) {
    const url = `${BASE_URL}/projects/${authorUsername}/${projectName}/favourites`;
    const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`)
        }
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при удалении из избранного: ${resp.status}`);
    }
    if (resp.status === 204) return true;
    return await resp.json();
}

export async function getUserFavouritesApi(currentUser, currentPass, userToLoad) {
    const url = `${BASE_URL}/users/${userToLoad}/favourites`;
    const resp = await fetch(url, {
        headers: {
            Authorization: 'Basic ' + btoa(`${currentUser}:${currentPass}`)
        }
    });
    if (!resp.ok) {
        throw new Error(`Ошибка при загрузке избранных: ${resp.status}`);
    }
    return await resp.json();
}