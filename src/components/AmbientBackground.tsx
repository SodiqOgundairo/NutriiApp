import { motion, useReducedMotion } from 'motion/react'

const BLOBS = [
  {
    className: 'top-[22%] left-[5%] h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(196,223,198,0.95),transparent_65%)]',
    animate: { x: ['0vw', '55vw', '10vw', '0vw'], y: ['0vh', '-12vh', '8vh', '0vh'], scale: [1, 1.12, 0.95, 1] },
    duration: 22,
  },
  {
    className: 'top-[30%] right-[5%] h-[640px] w-[640px] bg-[radial-gradient(circle,rgba(253,238,231,1),transparent_65%)]',
    animate: { x: ['0vw', '-60vw', '-15vw', '0vw'], y: ['0vh', '10vh', '-10vh', '0vh'], scale: [1, 0.94, 1.1, 1] },
    duration: 26,
  },
  {
    className: 'bottom-[10%] left-[30%] h-[720px] w-[720px] bg-[radial-gradient(circle,rgba(196,223,198,0.8),transparent_65%)]',
    animate: { x: ['0vw', '35vw', '-35vw', '0vw'], y: ['0vh', '-14vh', '6vh', '0vh'], scale: [1, 1.1, 0.96, 1] },
    duration: 24,
  },
]

function AmbientBackground() {
  const reduceMotion = useReducedMotion()
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#fafafa]">
      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={reduceMotion ? undefined : blob.animate}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default AmbientBackground
