import {Router} from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import {AIController} from "../controllers/ai-controller.js";
import { CatalogGenerationController } from '../controllers/catalog-generation-controller.js';

const aiRouter = new Router();

aiRouter.post('/chat', authMiddleware, AIController.chat);

aiRouter.post('/homework/generate', authMiddleware, AIController.generateHomework);

// Role checks will be added when administrator access is introduced.
aiRouter.post('/catalog/runs', authMiddleware, CatalogGenerationController.create);
aiRouter.get('/catalog/runs/:runId', authMiddleware, CatalogGenerationController.get);
// One position per request keeps progress durable and requests bounded.
aiRouter.post('/catalog/runs/:runId/advance', authMiddleware, CatalogGenerationController.advance);
aiRouter.post('/catalog/runs/:runId/publish', authMiddleware, CatalogGenerationController.publish);
aiRouter.post('/catalog/runs/:runId/reject', authMiddleware, CatalogGenerationController.reject);

export default aiRouter;
