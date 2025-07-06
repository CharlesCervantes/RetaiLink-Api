import { Request, Response } from "express";
import { create_producto, Productos } from "../core/productos";

export const crear_producto = async (req: Request, res: Response) => {
  try {
    const { vc_nombre, vc_descripcion, vc_image_url, id_negocio } = req.body;

    if (!vc_nombre) {
      return res.status(400).json({ ok: false, message: "Nombre requerido" });
    }

    const idProducto = await create_producto({
      vc_nombre,
      vc_descripcion,
      vc_image_url,
      id_negocio,
    });

    const new_producct: Productos = {
      id_producto: idProducto,
      vc_nombre,
      vc_descripcion,
      vc_image_url,
      id_negocio,
      dt_registro: Math.floor(Date.now() / 1000),
      dt_actualizacion: Math.floor(Date.now() / 1000),
    }

    return res.status(201).json({
      ok: true,
      data: { ...new_producct },
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
