import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useGetAllLinksQuery,
} from '@/app/features/shortener/shortener.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APP_URL } from '@/config/config';
import useAuth from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/error';
import { Copy, Link2Icon, LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const URLShortener = () => {
  const { logout } = useAuth();
  const [inputUrl, setInputUrl] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [createLink, { isLoading: isCreating }] = useCreateLinkMutation();
  const [deleteLink, { isLoading: isDeleting }] = useDeleteLinkMutation();
  const { data: linksData, isLoading: isLoadingLinks } = useGetAllLinksQuery();

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    try {
      await createLink({ original_link: inputUrl }).unwrap();
      toast.success('Link shortened successfully!');
      setInputUrl('');
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create short link');
      toast.error(message);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink({ linkId }).unwrap();
      toast.success('Link deleted successfully!');
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete link');
      toast.error(message);
    }
  };

  const handleCopyLink = async (linkId: string, shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedLinkId(linkId);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const links = linksData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b bg-white border-b-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 text-xl font-semibold text-blue-600">
            <Link2Icon /> URL Shortener
          </div>
          <Button onClick={logout} variant="ghost" className="gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mt-20 px-4">
        <h1 className="text-5xl font-extrabold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Shorten Your Looong Links :)
        </h1>
        <p className="mt-4 text-muted-foreground">
          ShortLink is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>

        <form
          onSubmit={handleCreateLink}
          className="mt-10 flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200"
        >
          <Input
            placeholder="Enter the link here"
            className="flex-1"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isCreating}
          />
          <Button
            type="submit"
            size="lg"
            className="bg-linear-to-r from-indigo-500 to-purple-500 text-white h-11"
            disabled={isCreating || !inputUrl.trim()}
          >
            {isCreating ? 'Shortening...' : 'Shorten Now!'}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <span>
            You have created{' '}
            <strong className="text-blue-600">{links.length}</strong> link
            {links.length !== 1 ? 's' : ''}. You can add up to{' '}
            <strong className="text-blue-600">{100 - links.length}</strong>{' '}
            additional links.
          </span>
        </div>
      </section>

      {/* Table */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short Link</TableHead>
                <TableHead>Original Link</TableHead>
                <TableHead className="text-center">Clicks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLinks ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading links...
                  </TableCell>
                </TableRow>
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No links created yet. Create your first short link above!
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium text-blue-600 flex items-center gap-2">
                      <div className="flex items-center gap-2 h-full">
                        {`${APP_URL}/${link.keyword}`}
                        {copiedLinkId === link.id ? (
                          <span className="text-green-600 font-medium text-xs">
                            Copied!
                          </span>
                        ) : (
                          <Copy
                            size={14}
                            className="cursor-pointer hover:text-blue-700"
                            onClick={() =>
                              handleCopyLink(
                                link.id,
                                `${APP_URL}/${link.keyword}`,
                              )
                            }
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className="truncate max-w-xs"
                      title={link.original_url}
                    >
                      {link.original_url}
                    </TableCell>
                    <TableCell className="text-center">{link.clicks}</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>{formatDate(link.created_at)}</TableCell>
                    <TableCell className="text-center">
                      <Trash2
                        size={16}
                        className={`mx-auto cursor-pointer ${
                          isDeleting
                            ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                        onClick={() => !isDeleting && handleDeleteLink(link.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default URLShortener;
