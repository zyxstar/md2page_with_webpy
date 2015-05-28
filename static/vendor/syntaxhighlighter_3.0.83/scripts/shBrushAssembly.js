/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var commands =	'eax ax ah al '+
                    'ecx cx ch cl '+
                    'edx dx dh dl '+
                    'ebx bx bh bl '+
                    'esi si '+
                    'edi di '+
                    'esp sp '+
                    'ebp bp '+
                    'rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15 '
                     ;
		var keywords =  'mov movl movw movb ' +
                    'movsbw movsbl movswl movzbw movzbl movzwl ' +
                    'push pushl pop popl pushq popq ' +
                    'leal ' +
                    'inc incl incw incb incq ' +
                    'dec decl decw decb decq ' +
                    'neg negl negw negb negq ' +
                    'not notl notw notb notq ' +
                    'add addl addw addb addq ' +
                    'sub subl subw subb subq ' +
                    'imul imull mull imulq mulq ' +
                    'xor xorl xorw xorb xorq ' +
                    'or orl orw orb orq ' +
                    'and andl andw andb andq ' +
                    'sal sall salw salb salq ' +
                    'shl shll shlw shlb shlq ' +
                    'sar sarl sarw sarb sarq ' +
                    'shr shrl shrw shrb shrq ' +
                    'cltd ' +
                    'idivl divl idivq divq ' +
                    'cmp cmpl cmpw cmpb cmpq ' +
                    'test testl testw testb testq ' +
                    'sete setne sets setns ' +
                    'setg setge setl setle ' +
                    'seta setae setb setbe ' +
                    'setz setnz setnle setnl setnge setng setnbe setnb setnae setna ' +
                    'jmp jmp je jne js jns jg jge jl jle ja jae jb jbe ' +
                    'jz jnz jnle jnl jnge jng jnbe jnb jnae jna ' +
                    'cmove cmovne cmovs cmovns cmovg cmovge cmovl cmovle cmova cmovae cmovb cmovbe ' +
                    'cmovz cmovnz cmovnle cmovnl cmovnge cmovng cmovnbe cmovnb cmovae cmovna ' +
                    'call leave ret callq req' +
                    'movabsq movq movsbq movswq movslq movzbq movzwq ' +
                    'cltq cqto cdq ' +
                    ' mov movt mvn add adc sub sbc rsb rsc mul mla mls umull umlal smull smlal orr eor and bic lsr lsl asr ror rev rev16 revsh rbit uxtb16 uxtb uxth sxtb16 sxtb sxth cmp cmn teq tst mrs msr swi svc ldr str ldm stm swp push pop b bl bx clz qadd qadd8 qadd16 qsub qsub16 qsub8 ssat ssat16 usat usat16 mrc mc ldmfd stmfd ldmia '+


                    '';

		this.regexList = [
			{ regex: new RegExp("\@.+?$", 'gm'),                        css: 'comments' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),			css: 'keyword' },		// keywords
			{ regex: new RegExp(this.getKeywords(commands), 'gm'),			css: 'functions' },		// commands
			{ regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },
			{ regex: new RegExp("\%", 'gm'),                            css: 'color2' },
			{ regex: new RegExp("\\$", 'gm'),                            css: 'color1' }
			];
			//console.log(new RegExp(this.getKeywords(keywords), 'gm'))
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['assembly', 'masm'];

	SyntaxHighlighter.brushes.Assembly = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
