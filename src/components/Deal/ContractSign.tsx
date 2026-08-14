import { useEffect, useRef, useState } from 'react';
import { FileCheck, Download, Upload, X } from 'lucide-react';
import { Button } from '../common/Button';
import { generateContractPdf } from '../../lib/contractPdf';
import type { Match, ContractRecord } from '../../lib/types';

/**
 * A demo-grade signature, not a legal one — said plainly on the page itself
 * (both on screen and inside the PDF footer). This is the actual line
 * between "proposed" and "real": nothing downstream (deliverables tracking,
 * campaign drafting) unlocks until both names are on this agreement.
 *
 * The agreement is a real generated PDF, not styled HTML pretending to be
 * one — it updates live as the signatory names are typed in. Either side can
 * swap in their own PDF instead, if they'd rather sign a document they
 * already drafted.
 */
export function ContractSign({
  match,
  sponsorName,
  dealValue,
  onBack,
  onSigned,
}: {
  match: Match;
  sponsorName: string;
  dealValue: number;
  onBack: () => void;
  onSigned: (record: ContractRecord) => void;
}) {
  const { profile } = match;
  const [sponsorSignatory, setSponsorSignatory] = useState(sponsorName);
  const [clubSignatory, setClubSignatory] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ready = sponsorSignatory.trim().length > 1 && clubSignatory.trim().length > 1 && agreed;
  const pdfUrl = uploaded?.url ?? generatedUrl;

  useEffect(() => {
    const blob = generateContractPdf(match, sponsorSignatory || sponsorName, dealValue);
    const url = URL.createObjectURL(blob);
    setGeneratedUrl(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, sponsorSignatory, dealValue]);

  useEffect(() => {
    return () => {
      if (uploaded) URL.revokeObjectURL(uploaded.url);
    };
  }, [uploaded]);

  function handleUpload(file: File | undefined) {
    if (!file) return;
    if (uploaded) URL.revokeObjectURL(uploaded.url);
    setUploaded({ file, url: URL.createObjectURL(file) });
  }

  function sign() {
    if (!ready) return;
    onSigned({
      dealValue,
      sponsorSignatory: sponsorSignatory.trim(),
      clubSignatory: clubSignatory.trim(),
      signedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-9 sm:py-12">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Sponsorship agreement</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.02] text-ink-950">
          Sign to make it real.
        </h1>
        <p className="mt-3 text-[15px] text-ink-500">
          A real generated agreement — demo-grade, not legally binding, said on the document itself.
          Prefer your own paperwork? Upload it instead.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg ring-1 ring-inset ring-paper-line">
        {pdfUrl && (
          <iframe title="Sponsorship agreement preview" src={pdfUrl} className="h-[420px] w-full bg-white" />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper-line bg-paper-dim px-4 py-2.5">
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={uploaded?.file.name ?? `${profile.name.replace(/\s+/g, '-').toLowerCase()}-agreement.pdf`}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          )}

          {uploaded ? (
            <button
              onClick={() => {
                URL.revokeObjectURL(uploaded.url);
                setUploaded(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-950"
            >
              <X className="h-3.5 w-3.5" />
              Using "{uploaded.file.name}" — remove
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm font-medium text-flare-600 hover:text-flare-500"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload your own agreement
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="eyebrow text-ink-400">Sponsor signatory</span>
          <input
            value={sponsorSignatory}
            onChange={(e) => setSponsorSignatory(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full rounded-lg bg-white px-5 py-3.5 font-display text-lg text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink-400">{profile.name} signatory</span>
          <input
            value={clubSignatory}
            onChange={(e) => setClubSignatory(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full rounded-lg bg-white px-5 py-3.5 font-display text-lg text-ink-950 ring-1 ring-inset ring-paper-line placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-flare-500"
          />
        </label>

        <label className="flex items-start gap-2.5 pt-1 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-sm border-paper-line accent-flare-500"
          />
          Both sides confirm these terms.
        </label>
      </div>

      <div className="mt-8 border-t border-paper-line pt-8">
        <Button size="lg" disabled={!ready} onClick={sign}>
          <FileCheck className="h-4 w-4" />
          Sign agreement
        </Button>
      </div>
    </div>
  );
}
