import { Container, Grid } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useEffect, useState, type ComponentType } from "react";
import type { Product } from "../Product";

const ProductCardWithProps = ProductCard as ComponentType<Product>;

const HomePage = () => {

    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/products");
                const result = await response.json(); 

                if (result && Array.isArray(result.data)) {
                    setProduct(result.data);
                } else {
                    console.error("not found array");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);




    return (
        <Container sx={{ mt: 2 }} >
            <Grid container spacing={2}>
                {product.map((p) => (
                    <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProductCard {...p} />
                    </Grid>
                ))}

            </Grid>
        </Container>
    )
}

export default HomePage;