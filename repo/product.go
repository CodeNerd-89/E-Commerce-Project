package repo

import (
	"database/sql"
	"ecommerce/domain"
	"ecommerce/product"

	"github.com/jmoiron/sqlx"
)

type Product struct {
	ID          int     `json:"id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description string  `json:"description" db:"description"`
	Price       float64 `json:"price" db:"price"`
	ImgUrl      string  `json:"imageUrl" db:"img_url"`
}

type ProductRepo interface {
	product.ProductRepo
}

type productRepo struct {
	//productList []*Product // in memory -RAM E thake
	db *sqlx.DB // hard-disk e thakbe
}

func NewProductRepo(db *sqlx.DB) ProductRepo {
	repo := &productRepo{
		db: db,
	}
	return repo
}

func (r *productRepo) Create(p domain.Product) (*domain.Product, error) {
	query := `
	INSERT INTO products (title, description, price, img_url)
	VALUES ($1, $2, $3, $4)
	RETURNING id
	`
	row := r.db.QueryRow(query, p.Title, p.Description, p.Price, p.ImgUrl)
	err := row.Scan(&p.ID)
	if err != nil {
		return nil, err
	}
	return &p, nil
}
func (r *productRepo) Get(id int) (*domain.Product, error) {
	var prd domain.Product
	query := `SELECT id, title, description, price, img_url FROM products WHERE id = $1`
	err := r.db.Get(&prd, query, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &prd, nil
}
func (r *productRepo) List(page, limit int64) ([]*domain.Product, error) {
	var prdList []*domain.Product

	query := `SELECT id, title, description, price, img_url FROM products LIMIT $1 OFFSET $2`
	err := r.db.Select(&prdList, query, limit, (page-1)*limit+1)
	if err != nil {
		return nil, err
	}
	return prdList, nil
}
func (r *productRepo) Count() (int64, error) {
	query := `SELECT COUNT(*) FROM products`
	var count int64
	err := r.db.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
func (r *productRepo) Delete(id int) error {
	query := `DELETE FROM products WHERE id = $1`
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
func (r *productRepo) Update(p domain.Product) (*domain.Product, error) {
	query := `UPDATE products SET title = $1, 
	description = $2, 
	price = $3, 
	img_url = $4 
	WHERE id = $5
	`
	_, err := r.db.Exec(query, p.Title, p.Description, p.Price, p.ImgUrl, p.ID)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// func generateInitialProducts(r *productRepo) {
// 	prd1 := &Product{
// 		ID:          1,
// 		Title:       "Orange",
// 		Description: "Orange is nice fruit",
// 		Price:       100.0,
// 		ImgUrl:      "https://media.istockphoto.com/id/477836156/photo/orange-fruit-isolated-on-white.jpg?s=612x612&w=0&k=20&c=NQYciPqF0kRqnDMx7Vy96Qhtx2c37OiKPXtjMR3Oy-Y=",
// 	}
// 	prd2 := &Product{
// 		ID:          2,
// 		Title:       "Apple",
// 		Description: "Apple is nice fruit",
// 		Price:       200.0,
// 		ImgUrl:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbRG26TFwkmBZaEBRjSOY6NeHcOQJfdVwIkQ&s",
// 	}
// 	prd3 := &Product{
// 		ID:          3,
// 		Title:       "Mango",
// 		Description: "Mango is nice fruit",
// 		Price:       300.0,
// 		ImgUrl:      "https://png.pngtree.com/png-vector/20250303/ourmid/pngtree-ripe-mango-fruit-with-leaf-for-healthy-snack-png-image_15699037.png",
// 	}
// 	r.productList = append(r.productList, prd1)
// 	r.productList = append(r.productList, prd2)
// 	r.productList = append(r.productList, prd3)
// }
