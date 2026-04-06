package product

import "ecommerce/domain"

type service struct {
	PrdctRepo ProductRepo
}

func NewService(prdctRepo ProductRepo) Service {
	return &service{
		PrdctRepo: prdctRepo,
	}
}

func (svc *service) Create(p domain.Product) (*domain.Product, error) {
	return svc.PrdctRepo.Create(p)

}
func (svc *service) Get(id int) (*domain.Product, error) {
	return svc.PrdctRepo.Get(id)

}

// func (svc *service) List() ([]*domain.Product, error) {
// 	return svc.PrdctRepo.List()

// }
func (svc *service) Update(p domain.Product) (*domain.Product, error) {
	return svc.PrdctRepo.Update(p)

}
func (svc *service) Delete(id int) error {
	return svc.PrdctRepo.Delete(id)
}
