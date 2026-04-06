package product

import "ecommerce/domain"

func (svc *service) List(page, limit int64) ([]*domain.Product, error) {
	return svc.PrdctRepo.List(page, limit)
}
