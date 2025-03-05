import fs from 'fs';
import path from 'path';
import {App} from "h3";

export async function loadPlugins(app:App) {
    const pluginsDir = path.resolve(__dirname, '../../../..plugins');
    const pluginFolders = fs.readdirSync(pluginsDir).filter(folder =>
        fs.statSync(path.join(pluginsDir, folder)).isDirectory()
    );

    for (const folder of pluginFolders) {
        const backendPath = path.join(pluginsDir, folder, 'src/backend');

        if (fs.existsSync(backendPath)) {
            // Lade Backend-Routen
            const routesFile = path.join(backendPath, 'routes.ts');
            if (fs.existsSync(routesFile)) {
                const { default: routes } = await import(routesFile);
                app.use(`/api/${folder}`, routes);
                console.log(`✅ Plugin '${folder}' hat API-Routen geladen.`);
            }

            // Lade Middleware
            const middlewareFile = path.join(backendPath, 'middleware.ts');
            if (fs.existsSync(middlewareFile)) {
                const { default: middleware } = await import(middlewareFile);
                app.use(middleware);
                console.log(`✅ Plugin '${folder}' hat Middleware geladen.`);
            }
        }
    }
}
