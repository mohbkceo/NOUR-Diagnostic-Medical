import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">Page introuvable</h1>
      <Button as={Link} to="/" className="mt-6">
        Retour à l’accueil
      </Button>
    </div>
  )
}
