import service from "../services/catalog-generation-service.js";
import { successResponse, errorResponse } from "../utils/ApiError.js";

async function respond(res, action, status = 200) {
  try {
    return res.status(status).json(successResponse(await action()));
  } catch (error) {
    // Never return SDK requests, headers, credentials or raw SQL errors.
    const known =
      error.status || (error.code === "BUDGET_EXHAUSTED" ? 409 : 500);
    return res
      .status(known)
      .json(
        errorResponse(
          known === 500
            ? "Catalog generation failed; check server configuration"
            : error.message,
        ),
      );
  }
}

export const CatalogGenerationController = {
  create: (req, res) => respond(res, () => service.create(req.body), 201),
  get: (req, res) => respond(res, () => service.get(req.params.runId)),
  advance: (req, res) => respond(res, () => service.advance(req.params.runId)),
  publish: (req, res) =>
    respond(res, () => service.publish(req.params.runId, req.body?.itemIds)),
  reject: (req, res) =>
    respond(res, () =>
      service.reject(req.params.runId, req.body?.itemId, req.body?.reason),
    ),
};
