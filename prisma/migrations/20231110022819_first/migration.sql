-- CreateTable
CREATE TABLE `aseguradoras` (
    `IDAseguradora` INTEGER NOT NULL,
    `NombreAseguradora` VARCHAR(100) NULL,
    `Direccion` VARCHAR(100) NULL,
    `NumContacto` VARCHAR(255) NULL,

    PRIMARY KEY (`IDAseguradora`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignaciones` (
    `IDPaciente` INTEGER NOT NULL,
    `FechaAsignacion` DATE NULL,
    `IDDoctor` INTEGER NOT NULL,
    `IDPersonaApoyo` INTEGER NOT NULL,
    `IDPoliza` INTEGER NOT NULL,

    INDEX `IDDoctor`(`IDDoctor`),
    INDEX `IDPersonaApoyo`(`IDPersonaApoyo`),
    INDEX `IDPoliza`(`IDPoliza`),
    PRIMARY KEY (`IDPaciente`, `IDDoctor`, `IDPersonaApoyo`, `IDPoliza`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `IDCita` INTEGER NOT NULL AUTO_INCREMENT,
    `IDPaciente` INTEGER NULL,
    `IDDoctor` INTEGER NULL,
    `TipoCita` ENUM('Estandar', 'DePrueba') NULL,
    `EstatusCita` ENUM('Realizada', 'Agendada', 'Cancelada') NULL,
    `Fecha` DATE NULL,

    INDEX `IDDoctor`(`IDDoctor`),
    INDEX `IDPaciente`(`IDPaciente`),
    PRIMARY KEY (`IDCita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctores` (
    `IDDoctor` INTEGER NOT NULL AUTO_INCREMENT,
    `CedulaProfesional` INTEGER NOT NULL,
    `Nombre` VARCHAR(255) NULL,
    `Apellido` VARCHAR(255) NULL,
    `FechaNacimiento` DATE NULL,
    `CostoCita` DOUBLE NULL,
    `Especialidad` VARCHAR(255) NULL,

    PRIMARY KEY (`IDDoctor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresasterceras` (
    `idEmpresaTercera` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NULL,
    `Descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`idEmpresaTercera`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factura` (
    `idFactura` INTEGER NOT NULL AUTO_INCREMENT,
    `idCita` INTEGER NULL,
    `Costo` DOUBLE NULL,

    INDEX `idCita`(`idCita`),
    PRIMARY KEY (`idFactura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loginventarios` (
    `IDLog` INTEGER NOT NULL AUTO_INCREMENT,
    `IDUsuario` INTEGER NULL,
    `TimeStamp` DATE NULL,
    `IDMedicina` INTEGER NULL,
    `Cantidad` INTEGER NULL,

    INDEX `IDMedicina`(`IDMedicina`),
    INDEX `IDUsuario`(`IDUsuario`),
    PRIMARY KEY (`IDLog`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `IDLote` INTEGER NOT NULL AUTO_INCREMENT,
    `IDMedicina` INTEGER NULL,
    `FechaManufactura` DATE NOT NULL,
    `FechaExpiración` DATE NOT NULL,
    `IDProveedor` INTEGER NULL,
    `CantidadRecibida` FLOAT NOT NULL,
    `CantidadRestante` FLOAT NOT NULL,
    `UbicacionAlmacen` VARCHAR(100) NULL,

    INDEX `IDMedicina`(`IDMedicina`),
    INDEX `IDProveedor`(`IDProveedor`),
    PRIMARY KEY (`IDLote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicinas` (
    `IDMedicina` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreMedicina` VARCHAR(255) NOT NULL,
    `Descripción` TEXT NULL,
    `Precio_Unitario` DOUBLE NULL,
    `Criticidad` ENUM('Alto', 'Medio', 'Bajo') NULL,
    `NivelDeInventario` INTEGER NULL,

    PRIMARY KEY (`IDMedicina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes` (
    `IDOrden` INTEGER NOT NULL AUTO_INCREMENT,
    `IDUsuario` INTEGER NULL,
    `FechaOrden` DATE NULL,
    `IDProveedor` INTEGER NULL,
    `IDMedicina` INTEGER NULL,
    `CantidadOrdenada` DATE NULL,
    `EntregaEsperada` DATE NULL,
    `Costo` DOUBLE NULL,
    `Estatus` ENUM('Realizado', 'Agendado', 'Cancelado') NULL,

    INDEX `IDMedicina`(`IDMedicina`),
    INDEX `IDProveedor`(`IDProveedor`),
    INDEX `IDUsuario`(`IDUsuario`),
    PRIMARY KEY (`IDOrden`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pacientes` (
    `IDPaciente` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NULL,
    `Apellido` VARCHAR(255) NULL,
    `Padecimento` VARCHAR(255) NULL,
    `EstatusPaciente` ENUM('Muerto', 'Critico', 'Atencion_Constante', 'Estable', 'Servicio_Expirado') NULL,
    `SaldoActual` DOUBLE NULL,

    PRIMARY KEY (`IDPaciente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personasapoyo` (
    `IDPersonaApoyo` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NULL,
    `Apellido` VARCHAR(255) NULL,
    `TipoDeServicio` VARCHAR(255) NULL,

    PRIMARY KEY (`IDPersonaApoyo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `polizas` (
    `IDPoliza` INTEGER NOT NULL AUTO_INCREMENT,
    `IDAseguradora` INTEGER NULL,
    `Vigencia_de_Poliza` DATE NULL,
    `TipoDePoliza` ENUM('Premium', 'Estandar', 'Basica') NULL,
    `SumaAsegurada` DOUBLE NULL,
    `FechaInicio` DATE NULL,
    `Prima` DOUBLE NULL,

    INDEX `IDAseguradora`(`IDAseguradora`),
    PRIMARY KEY (`IDPoliza`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `IDProveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Ubicación` VARCHAR(255) NULL,
    `NumContacto` VARCHAR(255) NULL,

    PRIMARY KEY (`IDProveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receta` (
    `IDReceta` INTEGER NOT NULL AUTO_INCREMENT,
    `IDCita` INTEGER NULL,
    `IDMedicina` INTEGER NULL,
    `CantidadDiaria` INTEGER NULL,
    `Indicaciones` TEXT NULL,

    INDEX `IDCita`(`IDCita`),
    INDEX `IDMedicina`(`IDMedicina`),
    PRIMARY KEY (`IDReceta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviciosextra` (
    `IDServicio` INTEGER NOT NULL AUTO_INCREMENT,
    `IDEmpresaTercera` INTEGER NULL,
    `IDPaciente` INTEGER NULL,
    `Fecha_contratada` DATE NULL,
    `Costo` DOUBLE NULL,
    `Estatus` ENUM('Realizado', 'Agendado', 'Cancelado') NULL,

    INDEX `IDEmpresaTercera`(`IDEmpresaTercera`),
    INDEX `IDPaciente`(`IDPaciente`),
    PRIMARY KEY (`IDServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `IDUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Password` VARCHAR(100) NULL,
    `TipoAcceso` ENUM('Almacen', 'Proveedor', 'Ejecutivo', 'Compras') NULL,

    PRIMARY KEY (`IDUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`IDPersonaApoyo`) REFERENCES `personasapoyo`(`IDPersonaApoyo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_ibfk_2` FOREIGN KEY (`IDDoctor`) REFERENCES `doctores`(`IDDoctor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_ibfk_3` FOREIGN KEY (`IDPaciente`) REFERENCES `pacientes`(`IDPaciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_ibfk_4` FOREIGN KEY (`IDPoliza`) REFERENCES `polizas`(`IDPoliza`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`IDDoctor`) REFERENCES `doctores`(`IDDoctor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`IDPaciente`) REFERENCES `pacientes`(`IDPaciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `factura` ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`idCita`) REFERENCES `citas`(`IDCita`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loginventarios` ADD CONSTRAINT `loginventarios_ibfk_1` FOREIGN KEY (`IDMedicina`) REFERENCES `medicinas`(`IDMedicina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loginventarios` ADD CONSTRAINT `loginventarios_ibfk_2` FOREIGN KEY (`IDUsuario`) REFERENCES `usuarios`(`IDUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_ibfk_1` FOREIGN KEY (`IDProveedor`) REFERENCES `proveedores`(`IDProveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_ibfk_2` FOREIGN KEY (`IDMedicina`) REFERENCES `medicinas`(`IDMedicina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`IDProveedor`) REFERENCES `proveedores`(`IDProveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_ibfk_2` FOREIGN KEY (`IDMedicina`) REFERENCES `medicinas`(`IDMedicina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_ibfk_3` FOREIGN KEY (`IDUsuario`) REFERENCES `usuarios`(`IDUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `polizas` ADD CONSTRAINT `polizas_ibfk_1` FOREIGN KEY (`IDAseguradora`) REFERENCES `aseguradoras`(`IDAseguradora`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `receta` ADD CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`IDCita`) REFERENCES `citas`(`IDCita`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `receta` ADD CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`IDMedicina`) REFERENCES `medicinas`(`IDMedicina`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `serviciosextra` ADD CONSTRAINT `serviciosextra_ibfk_1` FOREIGN KEY (`IDEmpresaTercera`) REFERENCES `empresasterceras`(`idEmpresaTercera`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `serviciosextra` ADD CONSTRAINT `serviciosextra_ibfk_2` FOREIGN KEY (`IDPaciente`) REFERENCES `pacientes`(`IDPaciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
