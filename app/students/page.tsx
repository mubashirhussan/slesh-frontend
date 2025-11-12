import StudentsFAQ from '@/components/sections/Students/StudentsFAQ';
import StudentsHero from '@/components/sections/Students/StudentsHero';
import UseCases from '@/components/sections/Students/UseCases';
import React from 'react';

const StudentsPage = () => {
    return (
        <div>
            <StudentsHero/>
            <UseCases/>
            <StudentsFAQ/>
        </div>
    );
}

export default StudentsPage;
