package user

import (
	"ecommerce/domain"
)

type service struct {
	usrRepo UserRepo
}

func NewService(usrRepo UserRepo) Service {
	return &service{
		usrRepo: usrRepo,
	}
}

func (svc *service) Create(user domain.User) (*domain.User, error) {
	usr, err := svc.usrRepo.Create(user)
	if err != nil {
		return nil, err
	}
	return usr, nil
}
func (svc *service) Find(email, pass string) (*domain.User, error) {
	usr, err := svc.usrRepo.Find(email, pass)
	if err != nil {
		return nil, err
	}
	return usr, nil
}

func (svc *service) AdminExists() (bool, error) {
	return svc.usrRepo.AdminExists()
}
