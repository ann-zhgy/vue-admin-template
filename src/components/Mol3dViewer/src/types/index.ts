import {
  AtomSelectionSpec,
  AtomSpec,
  AtomStyleSpec,
  GLViewer,
  SurfaceStyleSpec,
  SurfaceType
} from '3dmol'

export enum SupportedType {
  PDB = 'pdb',
  SDF = 'sdf',
  MOL = 'mol',
  MOL2 = 'mol2',
  XYZ = 'xyz',
  CIF = 'cif',
  GRO = 'gro',
  JSON = 'json',
  MMTF = 'mmtf',
  PQR = 'pqr',
  SMILES = 'smiles'
  // PRMTOP = 'prmtop'
  // VASP = 'vasp'
}

export interface DivProps {
  backgroundColor: string
  width: string
  height: string
}

export interface SurfaceProps {
  type: SurfaceType
  style: SurfaceStyleSpec
  atomsel?: AtomSelectionSpec
  allsel?: AtomSelectionSpec
  focus?: AtomSelectionSpec
}

export interface ViewerProps {
  // 背景色
  backgroundColor: string
  // 透明度
  backgroundAlpha?: number
  // 3d图形中的基础元素的样式配置，
  atomStyle: AtomStyleSpec
  surface?: SurfaceProps
  atomClickCallback?: (atom: AtomSpec, viewer: GLViewer) => void
}
