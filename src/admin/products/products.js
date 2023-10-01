import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { DownOutlined, InteractionOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { CloseOutlined, FolderViewOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import ToasterUi from 'toaster-ui';
import './products.css'


const Products = () => {
  const toaster = new ToasterUi();
  const [form] = Form.useForm();
  const [productsList, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [addProductVisible, setAddProductVisible] = useState(false);
  const items = [ // Use MenuProps['items'] to define items
  {
   key: '1',
   label: (
     <a className="AdminDropDownButton" onClick={()=>{setAddProductVisible(false)}}><FolderViewOutlined /> VIEW PRODUCTS</a>
   ),
   // icon: <HomeOutlined />,
 },
  {
   key: '2',
   label: (
     <a className="AdminDropDownButton" onClick={() => { setAddProductVisible(true) }}><PlusCircleOutlined /> ADD PRODUCTS</a>
   ),
   // icon: <HomeOutlined />,
 }
 
];
  // State variables for form data
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    brand: '',
    category: '',
    description: '',
    thumbnail: '',
    images: [], // Array to store image links
    newImageLink: '', // Temporary storage for a new image link
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}admin/getProducts`);
        setProduct(response.data.response);
        setFilteredProducts(response.data.response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchProduct(searchValue);

    const filtered = productsList.filter((product) =>
      product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchProduct('');
    setFilteredProducts(productsList);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}admin/deleteProduct`, { id: id });
      if (response.status === 200) {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}admin/getProducts`);
        setProduct(response.data.response);
        setFilteredProducts(response.data.response);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageLinkChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      images: newImages,
    }));
  };
  
  const handleSubmit = async () => {
    // Make sure to include the 'description' field in the formData
    const formDataWithDescription = {
      ...formData,
      description: formData.description || '', // Provide a default empty string if 'description' is not filled
    };
    console.log(formDataWithDescription)
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/users/setProducts`, formDataWithDescription);
      if (response.status === 200) {
        toaster.addToast("Item added successfully", 'success', {
          duration: 3000,
          styles: {
            backgroundColor: 'green',
            color: '#ffffff',
          },
        });
        const response1 = await axios.get(`${process.env.REACT_APP_SERVER_URL}admin/getProducts`);
        setProduct(response1.data.response);
        setFilteredProducts(response1.data.response);
        setAddProductVisible(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <>
      <header className='CustomerHeader'>
        <div className='title'>PRODUCTS</div>
        <div className='ProductsDropDown'>
          <Dropdown className="AdminDropdown" menu={{ items }}  >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
              <InteractionOutlined /> ACTIONS
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className='Search'>
          <Input
            className='input'
            placeholder="Search Product"
            value={searchProduct}
            onChange={handleSearchChange}
            prefix={<SearchOutlined className="site-form-item-icon" style={{ borderRadius: 0 }} />}
          />
          <button onClick={clearSearch}>Clear</button>
        </div>
      </header>
      {!addProductVisible && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>description</th>
              <th>PRICE</th>
              <th>RATING</th>
              <th>STOCK</th>
              <th>DISCOUNT</th>
              <th>BRAND</th>
              <th>CATEGORY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price * 80}</td>
                  <td>{item.rating}</td>
                  <td>{item.stock}</td>
                  <td>{item.discountPercentage}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>
                    <button onClick={() => handleDelete(item.id)}>
                      DELETE <DeleteOutlined />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {addProductVisible && (
        <div className='NewProductContainer'>
          <div>
            <div className="row g-3">
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">ID</label>
                <input type="text" className="form-control" placeholder="ID" aria-label="City" name="id" onChange={handleInputChange} value={formData.id} />
              </div>
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">TITLE</label>
                <input type="text" className="form-control" placeholder="TITLE" aria-label="State" name="title" onChange={handleInputChange} value={formData.title} />
              </div>
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">PRICE</label>
                <input type="text" className="form-control" placeholder="PRICE" aria-label="Zip" name="price" onChange={handleInputChange} value={formData.price} />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm col-form-label">DISCOUNT PERCENTAGE</label>
                <input type="text" className="form-control" placeholder="DISCOUNT PERCENTAGE" aria-label="City" name="discountPercentage" onChange={handleInputChange} value={formData.discountPercentage} />
              </div>
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">RATING</label>
                <input type="text" className="form-control" placeholder="RATING" aria-label="State" name="rating" onChange={handleInputChange} value={formData.rating} />
              </div>
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">STOCK</label>
                <input type="text" className="form-control" placeholder="STOCK" aria-label="Zip" name="stock" onChange={handleInputChange} value={formData.stock} />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">BRAND</label>
                <input type="text" className="form-control" placeholder="BRAND" aria-label="City" name="brand" onChange={handleInputChange} value={formData.brand} />
              </div>
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">CATEGORY</label>
                <input type="text" className="form-control" placeholder="CATEGORY" aria-label="State" name="category" onChange={handleInputChange} value={formData.category} />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-sm">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">description</label>
                <textarea type="text" className="form-control" placeholder="description" aria-label="City" name="description" onChange={handleInputChange} value={formData.description} />
              </div>
            </div>
            <div className="col-sm">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">THUMBNAIL LINK</label>
              <input type="text" className="form-control" placeholder="THUMBNAIL LINK" aria-label="City" name="thumbnail" onChange={handleInputChange} value={formData.thumbnail} />
            </div>
          

          <Form className="ImageList"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
            name="dynamic_form_complex"
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={{ items: [{}] }}
          >
            <Form.List name="items">
  {(fields, { add, remove }) => (
    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
      {fields.map((field, index) => (
        <Card
          size="small"
          title={`Image ${field.name + 1}`}
          key={field.key}
          extra={
            <CloseOutlined
              onClick={() => {
                remove(field.name);
              }}
            />
          }
        >
          <Form.Item
            label="Link"
            name={[field.name, 'Link']}
            fieldKey={[field.fieldKey, 'Link']}
            initialValue={formData.images[index]} // Set initial value from state
            onChange={(e) => handleImageLinkChange(index, e.target.value)} // Handle changes
          >
            <Input />
          </Form.Item>
        </Card>
      ))}

      <Button type="dashed" onClick={() => add()} block>
        + Add Item
      </Button>
    </div>
  )}
</Form.List>

          </Form>

          <div className="row g-3 col-sm-3" style={{ padding: 10 }}>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Product</button>
          </div>
        </div>
      </div>
    )}
  </>
); 
};

export default Products;

           
