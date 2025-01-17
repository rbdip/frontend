// src/api/projectApi.jsx

const BASE_URL = 'http://127.0.0.1:8080/api/v1';

/** Кодируем Basic Auth */
function encodeBasicAuth(username, password) {
    return btoa(`${username}:${password}`);
}


export async function loginUserApi(username, password) {
    const resp = await fetch(`http://127.0.0.1:8080/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + encodeBasicAuth(`${username}:${password}`),
        },
    });
    if (resp.status === 401) {
        return false;
    }
    if (!resp.ok) {
        throw new Error('Ошибка при логине: ' + resp.status);
    }
    return true;
}


/**
 * POST /api/v1/auth/register
 * Request body:
 * {
 *   "username": "admin2",
 *   "password": "admin2",
 *   "display_name": "Степан Андреевич" (optional)
 * }
 * Response body: {
 *   "id": 2,
 *   "username": "admin2",
 *   ...
 * }
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
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка регистрации: [${resp.status}]`);
    }
}

/** GET /api/v1/users/:username */
export async function getUserInfoApi(currentUser, currentPass, username) {
    const resp = await fetch(`${BASE_URL}/users/${username}`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при получении пользователя: [${resp.status}]`);
    }
    // При no-cors мы не можем распарсить JSON, вернём заглушку:
    return {};
}

/** PATCH /api/v1/users/:username */
export async function updateUserApi(currentUser, currentPass, userToUpdate, body) {
    const resp = await fetch(`${BASE_URL}/users/${userToUpdate}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при обновлении пользователя: [${resp.status}]`);
    }
}

/** DELETE /api/v1/users/:username */
export async function deleteUserApi(currentUser, currentPass, userToDelete) {
    const resp = await fetch(`${BASE_URL}/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при удалении пользователя: [${resp.status}]`);
    }
}

/** GET /api/v1/projects */
export async function getAllProjectsApi(username, password) {
    const resp = await fetch(`${BASE_URL}/projects`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(username, password)}`,
        },
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при получении projects: [${resp.status}]`);
    }
    return [];
}

/**
 * POST /api/v1/projects
 * Request body:
 * {
 *    "name": "...",
 *    "title": "...",
 *    "description": "..."
 * }
 * Response (прим.): {
 *   "id": 3,
 *   "title": "Мой 4 проект",
 *   "name": "rbdip1337",
 *   ...
 * }
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
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при создании проекта: [${resp.status}]`);
    }
    return {};
}

/** GET /api/v1/projects/:username/:projectName */
export async function getProjectByNameApi(currentUser, currentPass, authorUsername, projectName) {
    const resp = await fetch(`${BASE_URL}/projects/${authorUsername}/${projectName}`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при получении проекта: [${resp.status}]`);
    }
    // Возвращаем заглушку в стиле ТЗ:
    return {
        id: 2,
        title: 'Мой 4 проект',
        name: projectName,
        author_username: authorUsername,
        author_display_name: authorUsername,
        created_on: '2025-01-17',
        updated_on: '2025-01-17',
        description: '',
        display_version: 'default',
        versions: [
            {
                id: 2,
                display_name: 'default',
                display_order: 1,
            },
        ],
    };
}

/** PATCH update project (пример) */
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
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при обновлении проекта: [${resp.status}]`);
    }
}

/** DELETE /api/v1/projects/:username/:projectName */
export async function deleteProjectApi(currentUser, currentPass, authorUsername, projectName) {
    const resp = await fetch(`${BASE_URL}/projects/${authorUsername}/${projectName}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Basic ${encodeBasicAuth(currentUser, currentPass)}`,
        },
    });
    if (!resp.ok && resp.type !== 'opaque') {
        throw new Error(`Ошибка при удалении проекта: [${resp.status}]`);
    }
}
