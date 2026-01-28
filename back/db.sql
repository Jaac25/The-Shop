CREATE TABLE IF NOT EXISTS public."products"
(
	"id" SERIAL PRIMARY KEY,
	"price" int NOT NULL,
	"image" text,
	"name" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public."transactions"
(
	"idTransaction" SERIAL PRIMARY KEY,
	"idTransactionWompi" text,
	"idProduct" integer,
	"createdAt" date,
    "finalizedAt" date,
    "amountInCents" float,
    "reference" text,
    "customerEmail" varchar(255),
    "status" varchar(255),
    "statusMessage" text,
	CONSTRAINT "idProduct" FOREIGN KEY ("idProduct") REFERENCES public."products"("idProduct")
);


INSERT INTO products (name, price, image) VALUES
('Vestido Elegante de Noche', 125000, 'https://images.pexels.com/photos/4907288/pexels-photo-4907288.jpeg'),
('Blusa de Seda Premium', 75000, 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg'),
('Pantalón Palazzo Chic', 98000, 'https://images.pexels.com/photos/2983469/pexels-photo-2983469.jpeg'),
('Chaqueta de Cuero Fino', 175000, 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg'),
('Bolso de Mano Vintage', 89000, 'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg'),
('Zapatos Elegantes', 110000, 'https://images.pexels.com/photos/19090/pexels-photo.jpg'),
('Sombrero Estilo Boutique', 45000, 'https://images.pexels.com/photos/247249/pexels-photo-247249.jpeg'),
('Bufanda de Seda', 35000, 'https://images.pexels.com/photos/2983465/pexels-photo-2983465.jpeg'),
('Collar de Moda Fina', 60000, NULL),
('Aros de Estilo Único', 43000, NULL),
('Cinturón de Cuero Elegante', 38000, 'https://images.pexels.com/photos/2983475/pexels-photo-2983475.jpeg'),
('Falda Midi Clásica', 72000, 'https://images.pexels.com/photos/2983466/pexels-photo-2983466.jpeg'),
('Top de Encaje Premium', 68000, 'https://images.pexels.com/photos/428336/pexels-photo-428336.jpeg'),
('Blazer Moderno', 130000, 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg'),
('Sudadera Boutique Casual', 56000, 'https://images.pexels.com/photos/2983468/pexels-photo-2983468.jpeg'),
('Jeans de Corte Clásico', 79000, 'https://images.pexels.com/photos/2983474/pexels-photo-2983474.jpeg'),
('Bolso Tote de Moda', 92000, 'https://images.pexels.com/photos/298865/pexels-photo-298865.jpeg'),
('Gafas de Sol Fashion', 65000, NULL),
('Pulsera Estilo Boutique', 29000, NULL),
('Traje de Fiesta Exclusivo', 145000, 'https://images.pexels.com/photos/4907273/pexels-photo-4907273.jpeg');


