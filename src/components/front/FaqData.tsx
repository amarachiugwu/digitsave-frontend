"use client"
import { useState } from 'react';
import FAQ from './FAQ';

const FaqData = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null);


    const faqData = [
        {
          question: "What is a Savings Account?",
          answer: "A savings account is a savings contract account deployed specifically for you which holds all you saves and balance."
        },
        {
          question: "What is a Savelock?",
          answer: "A savelock is just a single save box in your savings account where you can have a number of cryptoassets in it, and svings for that savelock is distributed among the included assets."
        },
        {
          question: "How many save lock can i have?",
          answer: "You can have as many savelock as you want, as long as you are saving in them"
        },
        {
          question: "What is a fixed saving?",
          answer: "A fixed saving is a saving that locks your saved funds until after a lock period has exceeded."
        },
        {
          question: "Who can access my savings account?",
          answer: "You are the only one who can access your savings account, because you are the only owner of your savings contract"
        },
        {
          question: "Can i transfer the owner of my saving account to another address?",
          answer: "Yes you can transfer the ownership of your saving account to another address, should incase your account is comporomised, but this take a period of 72 hours and if no counter request is made to stop the transfer of ownership, ownership will be transferred."
        }
        
    ];
      const handleToggle = (index: number) => {
        setOpenIndex(prevIndex => (prevIndex === index ? null : index));
      };

    return (
        <>
            {faqData.map((faq, index) => {
                return <FAQ key={index} question={faq.question} answer={faq.answer} isOpen={openIndex === index} onToggle={() => handleToggle(index)} />
            })}
        </>
    )
}

export default FaqData
