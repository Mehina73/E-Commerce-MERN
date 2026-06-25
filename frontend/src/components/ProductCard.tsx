import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import { useCart } from "../context/Cart/CartContext";


interface Props {
    _id: string,
    title: string,
    image: string,
    price: number
}

export default function ProductCard({ _id, title, image, price }: Props) {

    const { addItemToCart } = useCart();

    return (
        <Card sx={{ maxWidth: 320 }}>
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt="Laptop"
            />

            <CardContent>
                <Typography gutterBottom variant="h6">
                    {title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        mt: 2,
                        fontWeight: "bold",
                        color: "primary.main",
                    }}
                >
                    {price} EGP
                </Typography>
            </CardContent>

            <CardActions>
                <Button size="small" variant="contained" onClick={() => addItemToCart(_id)}>Add to Cart</Button>
                <Button size="small">Details</Button>
            </CardActions>
        </Card>
    );
}