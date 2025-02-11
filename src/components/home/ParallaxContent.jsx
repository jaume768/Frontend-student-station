import React from 'react';

const images = [
    {
        src: "multimedia/395e95bfd8bc0ba3148bc98e613aa3d6.jpg",
        alt: "Imagen 1",
        className: "floater behind small",
        style: { top: "50%", left: "17%" },
    },
    {
        src: "multimedia/6284ce8b590b39c85a54d5e69435b1a4.jpg",
        alt: "Imagen 2",
        className: "floater middel medium",
        style: { top: "60%", left: "42%" },
    },
    {
        src: "multimedia/book-fotos-profesional-top-models-supermodelos-moda-publicidad-editorial.jpg",
        alt: "Imagen 3",
        className: "floater behind small",
        style: { top: "10%", left: "50%" },
    },
    {
        src: "multimedia/d5c32f97c015f7b4f6cdb81ebd9fb1e4.jpg",
        alt: "Imagen 4",
        className: "floater front big",
        style: { top: "10%", left: "37%" },
    },
    {
        src: "multimedia/Fotografo-moda-profesional-madrid-barcelona-fashion-look-book.jpg",
        alt: "Imagen 5",
        className: "floater behind small",
        style: { top: "20%", left: "20%" },
    },
    {
        src: "multimedia/fotografo-moda-profesional.jpg",
        alt: "Imagen 6",
        className: "floater middel medium",
        style: { top: "4%", left: "24%" },
    },
    {
        src: "multimedia/fotografo-moda-publicidad-editorial-lifestyle-madrid-barcelona.jpg",
        alt: "Imagen 7",
        className: "floater behind small",
        style: { top: "75%", left: "2%" },
    },
    {
        src: "multimedia/fotografo-publicidad-publicitario-catalogos-moda-ropa-vestidos-modelos.jpg",
        alt: "Imagen 8",
        className: "floater front big",
        style: { top: "0%", left: "2%" },
    },
    {
        src: "multimedia/fotografo_madrid_fotografía_de_moda_cátalogo.jpg",
        alt: "Imagen 9",
        className: "floater middel medium",
        style: { top: "28%", left: "28%" },
    },
];

const ParallaxContent = () => {
    return (
        <div className="parallax-content">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={image.className}
                    style={image.style}
                />
            ))}
        </div>
    );
};

export default ParallaxContent;