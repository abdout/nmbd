'use client';
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner';

const TermsPage = () => {
    const [accepted, setAccepted] = useState(false);
    const router = useRouter();

    const handleCheckboxChange = (checked: boolean) => {
        setAccepted(checked);
        if (checked) {
            toast.success("تم قبول الشروط");
            router.push('/onboarding/attachment');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <p>
                لا تستثني الحركة احداَ من عامة السودانين الصالحين في ان تتقدم لهم بدعوتها، وهي كذلك تحرص على أن ينتمي لقياداتها وصفها من عرف عنه نظافة اليد، وصالح المسعى، ومن يتقي معوج المسلك وفاسد العمل.
            </p>
            <div className="flex items-center gap-2 pt-8">
                <Checkbox
                    id="terms"
                    checked={accepted}
                    onCheckedChange={handleCheckboxChange}
                />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    اقرأ <Link href="#" className='text-blue-800'>ارشادات</Link> و <Link href="#" className='text-blue-800'>اوراق</Link> الحركة قبل البدء
                </label>
            </div>
        </div>
    )
}

export default TermsPage;