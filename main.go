package main

import (
	"ecommerce/cmd"
	// "ecommerce/util"
	// "fmt"
)

func main() {
	cmd.Serve()
	// jwt, err := util.CreateJWT("secret", util.Payload{
	// 	Sub: 1234567890,
	// 	FirstName: "John",
	// 	LastName: "Doe",
	// 	Email: "john.doe@example.com",
	// 	IsShopOwner: true,
	// })
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	// fmt.Println(jwt)
}
