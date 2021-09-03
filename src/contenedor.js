const fs = require('fs');


class Contenedor {
    constructor(archivo){
        this.archivo=archivo
        this.id = 0
        this.data = []
    }

    async getAll(){
        try{
            const data = await fs.promises.readFile(this.archivo,'utf-8');
            if (data){
                this.data= JSON.parse(data)
                this.data.map((producto) => {
                    if (this.id < producto.id) this.id = producto.id
                })
                
            }
            return data
        } catch(error){
            console.log(error)

        }

    };

    async save(obj) {
        await this.getAll()
        this.id++
        this.data.push({
            id: this.id,
            producto: obj
        })
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.data,null,4))
        }catch(error){
            console.log(error)
        }
    };

    saveNewProduct = async (product) => {

        await this.getAll()

        this.id++
        const newProduct = {...product,id: this.id}
        this.data.push(newProduct)
        
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.data, null,4))
        }catch(error){
            console.log(error)
        }
        return product.id
    };

    async getById(idx){

        await this.getAll()
        
        try {

            const productById = this.data.find( product => product.id == idx );
    
    
            return productById

        } catch (error) {
            
            console.log (error)
        }



    };



    async deleteById(idx){

        await this.getAll()
        
        const producto = await this.getById(idx);

        if (producto) {

            const nuevaLista = this.data.filter( producto => producto.id != idx)
            const nuevaListaJson = JSON.stringify(nuevaLista,null,4)

            await fs.promises.writeFile(this.archivo, nuevaListaJson)

            return producto
        } else{
            return null
        }
    };

    updateById = async (id, newProduct) => {

        await this.getAll();
    
        const index = this.data.findIndex(product => product.id == id);

        let producto = this.data[index];
        
       
        if (producto) { 

            const { title, price, thumbnail } = newProduct;
                          
            producto.title = title;
            producto.price = price;
            producto.thumbnail = thumbnail;


            this.data[index] = producto;

            const nuevaListaJson = JSON.stringify(this.data,null,4);

            fs.promises.writeFile(this.archivo, JSON.stringify(this.data,null,4))

            return producto
            
        } else {

            return null
        }
    };

    deleteAll(){

        while(this.data.length > 0) {
            this.data.pop();
        }



        fs.promises.writeFile(this.archivo, JSON.stringify(this.data))

        
    };


}

module.exports = Contenedor;