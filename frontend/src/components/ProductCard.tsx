import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";


interface Props {
    id: string,
    title: string,
    image: string,
    price: number
}

export default function ProductCard({ title, image, price }: Props) {
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
                <Button size="small" variant="contained">Add to Cart</Button>
                <Button size="small">Details</Button>
            </CardActions>
        </Card>
    );
}