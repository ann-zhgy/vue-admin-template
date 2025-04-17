<script lang="tsx">
import { defineComponent, PropType, ref, watch } from 'vue'
import * as $3Dmol from '3dmol/build/3Dmol.js'
import { ElMessage } from 'element-plus'
import { AtomSpec, GLViewer, Gradient, SurfaceType, ViewerSpec } from '3dmol'
import { DivProps, SupportedType, ViewerProps } from './types'
import axios from '@/axios'
import { t } from '@/hooks/web/useI18n'

export default defineComponent({
  name: '3dMolViewer',
  props: {
    file: {
      type: File,
      default: () => null
    },
    fileType: {
      type: String as PropType<SupportedType>,
      default: () => null
    },
    fileUrl: {
      type: String,
      default: () => null
    },
    divProps: {
      type: Object as PropType<DivProps>,
      default: (): DivProps => {
        return {
          backgroundColor: 'antiquewhite',
          height: '500px',
          width: '100%'
        }
      }
    },
    viewerProps: {
      type: Object as PropType<ViewerProps>,
      default: (): ViewerProps => {
        return {
          backgroundColor: 'white',
          atomStyle: {
            line: { hidden: false },
            cross: { hidden: false },
            stick: { radius: 0.1 },
            sphere: { radius: 0.3 },
            cartoon: { hidden: false },
            clicksphere: { hidden: false }
          },
          surface: {
            type: SurfaceType.VDW,
            style: {
              opacity: 0.5,
              volscheme: new Gradient.RWB(-10, 10)
            }
          },
          atomClickCallback: (atom: AtomSpec, viewer) => {
            // console.log(atom)
            // atom 行的具体含义 https://blog.csdn.net/weixin_40013463/article/details/81735304
            if (atom.pdbline) ElMessage.info(atom.pdbline)
            if (atom.resn && atom.atom && atom.x && atom.y && atom.z) {
              viewer.addLabel(atom.resn + ':' + atom.atom, {
                position: { x: atom.x, y: atom.y, z: atom.z },
                backgroundColor: 'darkgreen',
                backgroundOpacity: 0.6
              })
            }
          }
        }
      }
    }
  },
  setup(props) {
    const divProps = ref(props.divProps)
    watch(
      () => props.divProps,
      (newValue) => (divProps.value = newValue)
    )
    watch(
      () => props.file,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          let reader = new FileReader()
          reader.readAsText(newValue, 'UTF-8')
          reader.onload = (e) => {
            view(e.target?.result, props.fileType, props.viewerProps)
          }
        }
      }
    )
    watch(
      () => props.fileUrl,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          axios.post({ url: newValue as string, responseType: 'blob' }).then((res) => {
            const blob = new Blob([res.data])
            view(blob, props.fileType, props.viewerProps)
          })
        }
      }
    )
    const view = (data: any, fileType: SupportedType, viewerProps: ViewerProps) => {
      const containerEle = document.getElementById('container-01')
      containerEle?.childNodes.forEach((item) => containerEle?.removeChild(item))
      const viewerEle = document.createElement('div')
      viewerEle.setAttribute('class', 'viewer_3Dmoljs')
      viewerEle.setAttribute('data-style', 'stick')
      viewerEle.setAttribute('data-ui', 'true')
      viewerEle.style.height = divProps.value.height
      viewerEle.style.width = divProps.value.width
      viewerEle.style.backgroundColor = divProps.value.backgroundColor
      containerEle?.appendChild(viewerEle)
      let viewer1: GLViewer = $3Dmol.createViewer(viewerEle, {
        backgroundColor: viewerProps.backgroundColor,
        backgroundAlpha: viewerProps.backgroundAlpha ?? 0
      } as ViewerSpec)
      if (!viewer1) {
        ElMessage.error(t('components.mol3dViewer.initFail'))
        return
      }
      viewer1.addModel(data, fileType)
      viewer1.setStyle(viewerProps.atomStyle)
      if (viewerProps.surface) {
        viewer1.addSurface(
          viewerProps.surface.type,
          viewerProps.surface.style,
          viewerProps.surface.atomsel,
          viewerProps.surface.allsel,
          viewerProps.surface.focus
        )
      }
      if (viewerProps.atomClickCallback) {
        viewer1.setClickable({}, true, viewerProps.atomClickCallback)
      }
      viewer1.render()
      viewer1.zoomTo()
    }
    return () => (
      <div
        id="container-01"
        style={{
          height: divProps.value.height,
          width: divProps.value.width,
          position: 'relative',
          backgroundColor: divProps.value.backgroundColor
        }}
      ></div>
    )
  }
})
</script>
