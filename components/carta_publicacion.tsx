import React from 'react';

interface CartaPublicacionProps {
  pub: {
    id: number | string;
    imagen: string;
    titulo: string;
    fecha: string;
    descripcion: string;
  };
  onClick: () => void;
}

export default function CartaPublicacion({ pub, onClick }: CartaPublicacionProps) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        border: "1px solid #dee2e6", 
        borderRadius: "12px", 
        overflow: "hidden", 
        cursor: "pointer", 
        transition: "transform 0.2s", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)" 
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <img 
        src={pub.imagen} 
        alt={pub.titulo} 
        style={{ width: "100%", height: "200px", objectFit: "cover" }} 
      />
      <div style={{ padding: "1.5rem" }}>
        <small style={{ color: "#6c757d", fontWeight: 600 }}>{pub.fecha}</small>
        <h3 style={{ margin: "0.5rem 0", color: "#212529" }}>{pub.titulo}</h3>
        <p style={{ 
          color: "#495057", 
          display: "-webkit-box", 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden", 
          margin: 0 
        }}>
          {pub.descripcion}
        </p>
      </div>
    </div>
  );
}
