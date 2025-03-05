import { config } from 'dotenv';
import { createApp } from 'h3';
import { loadPlugins } from './src/plugins/plugin-loader';

// Load environment variables
config();

const app = createApp();

// Plugins laden
loadPlugins(app);

export default app;
