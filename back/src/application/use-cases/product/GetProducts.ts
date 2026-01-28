import { ProductRepository } from "../../../domain/repositories/ProductRepository";

export class GetProducts {
  constructor(private repo: ProductRepository) {}

  execute() {
    return this.repo.findAll();
  }
}
