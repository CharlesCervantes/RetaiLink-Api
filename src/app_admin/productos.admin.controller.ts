import { Request, Response } from "express";
import { create_producto } from "@/core/productos";

export const crear_producto = async (req: Request, res: Response) => {
  try {
    const { vc_nombre, vc_descripcion, vc_image_url } = req.body;

    if (!vc_nombre) {
      return res.status(400).json({ ok: false, message: "Nombre requerido" });
    }

    const idProducto = await create_producto({
      vc_nombre,
      vc_descripcion,
      vc_image_url,
    });

    return res.status(201).json({
      ok: true,
      data: { idProducto },
      message: "Producto creado correctamente",
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno al crear producto",
    });
  }
};
