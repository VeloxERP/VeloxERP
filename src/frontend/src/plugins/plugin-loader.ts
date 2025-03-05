import { createRouter, createWebHistory } from 'vue-router';

export async function loadFrontendPlugins() {
    const modules = import.meta.glob('../server/plugins/*/frontend/routes.ts');
    const routes = [];

    for (const path in modules) {
        const { default: moduleRoutes } = await modules[path]();
        routes.push(...moduleRoutes);
    }

    return createRouter({
        history: createWebHistory(),
        routes,
    });
}
