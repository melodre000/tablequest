const LiteApp = (() => {
  const {
    useState,
    useEffect,
    useRef
  } = React;
  const uid = () => Math.random().toString(36).slice(2, 10);
  const roll20 = () => Math.floor(Math.random() * 20) + 1;
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // Ordered by hue around the color wheel (Brown grouped with Orange as its
  // dark/desaturated cousin; Black and White are the achromatic outliers at
  // the end, dark to light).
  const ENEMY_COLORS = [{
    name: "Red",
    hex: "#ef4444"
  }, {
    name: "Orange",
    hex: "#f97316"
  }, {
    name: "Brown",
    hex: "#92400e"
  }, {
    name: "Yellow",
    hex: "#eab308"
  }, {
    name: "Light Green",
    hex: "#a3e635"
  }, {
    name: "Green",
    hex: "#22c55e"
  }, {
    name: "Light Blue",
    hex: "#7dd3fc"
  }, {
    name: "Blue",
    hex: "#3b82f6"
  }, {
    name: "Purple",
    hex: "#a855f7"
  }, {
    name: "Black",
    hex: "#3f3f46"
  }, {
    name: "White",
    hex: "#f8fafc"
  }];
  const NPC_COLOR = "#a1a1aa";
  const LOGO_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAQAElEQVR4nOxcCXgURdr+uueeyWRmcieE+1CR+wa5ZEWQWwQVRQWC4BHA3d//ccVd13VXlvVf1EVXWTkXEBQPFhQFhUURdJXDm0MgAQKE3Jkkkzl6uuuvvqsn03MkEf/n2b/Eoqen+quqr956662vejC2SXdRFIUAKACEEH+NgKL4a/Ev4O+I9+UccHkhF8sA/7TwrVhcvC/eBrm8ZFO6hpj2iVwsK5WRTDaxT7RZ0365kNRauc0a+5o2EO2Xk8HlsCmWhNLCBz5JLeMzog75QfFbxY5SEaDIIpRqP+IB0T6A1iPEw0SSHSK2ExRjhEe09tUntO2XbsvtR2pXUNNaAWhpMITxAcGLchclv/KjBELrhTrE+kAcH6FNSM6VtpLNk7ADgn2QagEplzxCjqrYZ8V3IKAbJC9TYmtBbqBoRsaOYF/8WiokjaiKHaFBFEW0X2izWIsykzQDk5/hljGvHSb5FoEdPS8T2IlWJPoz8jeRaI9qX8+CNMti2m/afhQJGP0W8ghClNxD+UkEMgdpsYNU7AjOReoYUkjTACTDS8KO9IyKHYkjNNiREISUyYNUJ1BIgxoE8ohK3CFOGgVaQr1A8o5QVGo/RWIHFOyofhXti51sk+EGEljK8woyI3gnYoyi8Q7EQ43SDg3vaAxpSje1E1lvVPtk+xXegYSwo9ynNbyDflbeIQw1h3fkfrWcd0heJhDUQt7RGYGoYxO5iv8f4x0gnEG3Gu+APG+T4h1oPd6BVuMdkpepNulugdV+Jt5JBjtXjXdIk7Tonf/XO0hHD9JitYpdhJT6ZN0p50r7JG+SDlenqdpPpefiPCL1DiK8pvhxRB/nByu77l7Z7YbeDnlQ1DGQSJwYJ1ALIa1WlnOCPUCaNVIOTRBEKfOO8CZvJk/cizV7n0Xug5q7z2qbbXpyfpvxQ1OV1n/wmfcP60rPlwbj7LOatDmpfZZUUm5z1H0oz0E/o95x2g1LZmUvvC0LFEJGoFyveqfy+a3lvgB3lXmH6DAYnHZLFN4hOJ+iEuEdYr3Txw5o9c6d4zLWPNlxVD+niP8jxxsWLT+37cOqLm2teRkmbGzAtbZZYz219ezxcwGk0dkIou3RVd6JaH8M3pGxCXIe0X4JQXB19c7A7o5nHm57XUeriO1L5aG/bLy8/7BXeXjMwNRf3Z2dn2UW0fRDsf+JVVcOn/BH2m89vaN5itSDPAddxfhObob5yfvbTB7pQYjDTzX42TXvlG16ryLMRnbBbKJm35JeMDWDh7hg/71Ddb9fV1ZaxbYkvpMI75A2eQcR00YHO6Ap0hzeAcpmoQrvyMF0YzULawRCOz6u+uuW0mpvGPRTWqpxyZ2ZU0a4hBpRMMi98s/qv71T3RjkWpl3xJWtiR6UERRr/DUI1K5ZKN6zfE7T1LTRnqUFbbLTjEJ57vszjU//veTH835ILHVrZ/nN3OxeXWziOl1aySzbVPn2J3X62CHXZY2PtGti3Gd5BLnj8462kkR5RzDRq6tj+eJ2vbraxGlaWhF84bXLuw/VQPJp/BDnI3dkYC+LTfzqdGDpq+XfFoVan3cIXqPy0lw/kd7J9BifmJ9/640eWrgTDHHrtl/ZsKM8yHDQ3ISJae5Ez5wJbquZFif/mx/XLXuturw63Iq8Q84PhYMUW63AO7gbD8zIKbwzF/OreP+Dg9UrNl6qrGGgNRIG0SO3p48fnCJwBWoMcC9ur1210xtiULP1DkToKbnzEoJakXcmj0rDdNM22yLO/+NnfcvWlHx32getnXp2sjx+T8a17c0iLi5WhP+wsWrXF/6W8w7ZRxVBLdc713W0PbOoPdY4ormKGmbla5fe/aQKIfiJEm7w5GEphbd5Ml0G0S9fngw8trrqVAkTvf2J8Q7ZVyo3zdVyvZPuNj02t82d4zNpwW4oxG56r3z1W6X+YPPpJvGEBUTBRNc9N6eaDHw7WY57fb9v2ZaamgbUPN4h9SCPoJbwjsEA86fnLLkrz2mXWHPv5zV/+UdJaUUIrm7KTTf+1+3uMX1tomJqaOSee9u7drePYYnOgK7ekc1E9lhEUDN556bBricfaN8xzyxUhc6WBJ5ede7rkw3w86X+3Sy/vsvdJc+E1RbuRtHl0NOv1X141J8U72j2YiKCktU7Xdra/1DYbnjfVHFAarzMS1suvbO3gvvJ6CbxRFNw6wjHQ1OcnhQhHIjg4A/Bpeu9Z0rDCfKOknhH5fKrWBJ6x5VieHRO/uyJWSYDr4nxHmrLrrJVb1z2+dkYjTabaIOBMtDA5wYaXxj5C/4P1tkG/McIBpp2O424Em8Dw3KIDQOfc4hjEcsiXBHLActyrHSBQjH1lN1KPTjZeccou1FoJ35k417fs281eH1cXN4h9ZTgIEiCd37YOdDttHAciymnqpYpKQuEGQ73kKaQ0QB8TguOoMFiEp3LCWKF35oijpMok8+E7nF8Lt3nkM1qBKOJcaQLd5BUkoclNiGUFJdwqbxgQbAfCISxC8JhVvAs71DelRwy0Sg/w+BJkXQjRvr1C64kFf8yqgUS4J3ObW1OUxiBJVhaUlVaU9/IGRiOC6NQmB9h/Ie/CAPmxbBwh+FzEPMQi4ddyDlcAMIsxRfD33IUn7PIbDEvfXggIMOfVhwNBkMmGkxGMPGgQ8I1ZaQ5AwVm7EP80cCPB+6/Ef/BBQyUehNf83f4QcLArKiFgI1Ky3CY0zM9tnDHHLq4jEtQ0+HbRgkcQi5OzxhxZfwXbTTjJ6vozIm/L0mAcSgi1/tWuv7vRUMdLgwHNHDEgP956VNIKFH6xtWEWendP3lyECYBPLul+FSCcXc6yfMsAdhc2O003DIyA1ovdeucNbSPhwpUU4HKoX3c+CO0Xho/JCUVqxAMWmmSEvFPeQiV7kac99EEE4OEGslflKQXALSRdizF2EY/O3dajtVCQyulxQsGZZsuCsSEsgwXFt8/CFop4fDTnHHOQJCjMduL4x2BHT4hItyqIWNa0spJnGfxt4794HU76ZljWwdEo4d36ZobhpCPr4NDFNPYNTs4+oZO0Bpp5minO4U+dqqRQ0ie8DJ2REzIedS4Ox2Xd8jdnexddPKsr6wydPu4DDzXoMWpsGCwI1QM0rLFz+KUYHFhwRBocXKl0DNvTLlSxZy6EKAUrojHO+qyJnJQPN6RsUPMMvz/37ddxui9d1ImtCzde0e/DMNFCTtSvThn0+Dc7Jl9oWVpzniXxUi9+q4Xt130QiK8I3kKBAQlyDsKghQ/HjhWd+Z846ThrjZZJmhuykx3TB3b0RQsVbDDGxekjcl/afq4DhkZDmhuapNpHD/YfvZS8OD3QcEhUs/j8o5y9s2vYonxjnreRNbx4utX8N37pzWfiR4qGJxrucDXgkThh0D2EbacBUUPz2k+Wy+Y7Mbz/6Xt8mmSNLoQl3dIXqbj8A6QuVKHpH+OF/m/+N43rKe9ewcLJJ96ds/t383G+WtFwc1bFkSzUJeQB6r6dzP16J4LySfcpKHdLZ/90Hj8vBgbUuYBROcdiK4H6Ti80/T9HQWNQnrl7XLcq8IZaZB8WrJwcBp1TmAfDsRc2JWQmwwPc3ZxQXNAVHirm+PQ6vfq1FsIUcRUieQdHT1Ix+EdBTuAiDqQUumlcmbPF/Vd8s3De9kgmTRh7LUd3PVUOChs1hBIqOHEXPAOnwPja+eonPCLa5IyPqqPvXOecc+XvkuVrOwcMY/JO9H0IB2Hd2TfAaXoABSh7Tfsqg6FuIVT3HR80S8lo4mef3dfW+A8Xy8SNpwSdoS5hoDAFDj8p+fP7os35QkaxzE8HGBkwty63fXKTYUZEuEdkpdpfb2j8o6Yi5G6CAThVOVltx+oy3LRk4baIbFUcNfADOqCumYJfgERNfLWX+qPUCYteLJg9oAEjU8ZlpLjod/6pMHboMZD5Bbr6h09PUjr6R0N78h1yO9ZETUKaetHdTj8fO/NKVZz/HHOz3OPG5lL+0tBDGLIa5Yc4iD5SAp6GBpKxg7Nyst1xTVut9Czb06tb2S37dcENgkEoah6R08P0np6R/U7Up9EylqgTY1BtPnDOqeNumN0fCZasmBwNnVO4h3xP5BVIkfwkTjLZM7OCZ9cUhAfRLNucqZYKdwY3CTyPlJAAhBV7+jpQVpP74h+V/BGvDeIlBcFyLT9kK+qNjxjuM3liAWiQX3bdm8LKOjlV3S+XZysoZEUQhMdxCl8JATM8A1fVc98dkCftjGMp7sMONhaVsPs/Lwx4isNM8TjHZKXaT29A/IzMvYQyMzfFEE44WAYPkLAIauCm2OBaNGCIa5wkRBIlGeTMr8kPkJaPhLbzfsupe67xTFBNO8Wl9lIrX+/jm0S/lVGV/gg3oof/8K107p6RzICmveVKdV3Tdu376vA+bLw2L6mNunRQTRzao88SxmEReXGKfpQXK3E4CxwImok9lH5COdsKJe+MG3C9VGNd8gx3TTAVnw5tP/rQNNv1V2ejt7R04M0+VnteQTvkCuiYitaevX9Rlxq4Thr068cDvOsad0t/vMydjTeEXYY8lom7cuEkZH4SFRJyFJ78p5p19rtUXZ/C6e4cJGXd3ijNgzJMyjZ+BcNunoHor6vrKIsWjp6JvxNETOoG909PzKWtvDegZlQLFxKq5WioUFZs1Q+kjwi85FwX+DsjMA3D9wTOdF6d7H062Y5eirwzdnoB5YEgpKLf9Gx9A6oq6BcCaglddIr7wdwhx8arxnkzh0zhvdzU43l8iou9VaopMmaJXwLMkMBoQD4+7UlI3qldGqfTtp/eJoLD+mr79bptUqZDYnwDqkH6fi8o/ie5CB9H50r5z7+ge2SA6OvV4G25P5BWahI1jsadICqoQWvSUsZJypsUVVT0h3JX2kNXz88t79i/Kb+dkxAe4/6zpXFepsPIaToOJRw/Ism3RCddwCI00RQLMZI6/cy+GRqzih8hMCXHDG04zXZQRSql/WOGtMgsMMpM0vlI/JADUl+5B8M1Fzj9g4f3AF/wqdAeGMRDnNr36+DmO6R91/Jxb9EByXzO4lYFCSlMi9690g4JxWm9OeLLp4/xBE4o0R85Bktr1nS3AEkKiOSj5CsrVVWEjkLOWuPLZ7XD5uZNiI1zUn/89OGqro4b5KI8zcR3gFCDxrFZ2PzjlRYnXdxEITT5oPcuJ7UrGHg6tgzAxUDf6KgPQ5V13h5fkk4V3maAg1na55imfTG43Nn9pjapwrvcjbvTeiNCXnlQonHv4xIFZZUxD5Fc06vXnMUFQ9C/AvQsO3fMGckzB8Z4DtmSZXniCxExCgiIFqEM8jfyv4SdonqHUCy8hau8bN0sOL+yZ0bvYE1269EbCz03EMpwTEU9RxV4ykRGsbEeIeMbyeEoFF9HJPGOGmugvJXHK7u3xikCJUQtfW6HyLuK4NoNzFD/KUU4qZO6nyl4cLHX8Z8cxYB8YYCl3j8y6hgR/f9IM3KBxrNHi11yjMtTicOIAAACsRJREFUus3Tvb0pFGQPnnaN7NYxfOLi0j+fgtZOzz6YWZdq+vw0Gtgv9TcL29062vPXLZeLLgailxaxL4c5YmGHPKcHCUFxeUfKIaZ38PncvAnucYPsmGg/PuZbvauu0sstS0sf3DN11AD3J0dqofUSjhn27mw+ciLw1NqqTE/Fghk5N/ZPXfV4+92f1a79Z4XX14SwlX2G0IHE41+0nt6RMCXJKLmQEqnUJhzEu31M6j+W5owfaDtzwb/kxfI/banF3sFfPb/hXIjhCu/ON5viM1eCCZt6cKqLYbgX3uadXlETfmb1xcLlRcUl/vGDHRt/23bmjamGpgeaSNHTScS/6ER4h5x4imZX0rCetnWP5Rbc4vT7w89urXp4ZdXJElWwVVQzm3ZexufUc6dlQyulObfwS/vmj+oratVt+8lzgYXLL/xlc5nfz9w/0bn20cyh3c2ax5oyBqF3ZJ9E6kEjxOUd+WslWqZEvNvn8HTTCx/8MezWfd7X/+ULhKLg640Pysbf4Jk+Jn3XgeqLZS19uTM/yzh9REpJWejNT6Is7R9+6TvwdeNdYxzTh9uemu38tij00g7f+Qo50gQQi3eg6W/QwOCwWUTvanhHukXm/DOeVMwyafj5b37039DD9shMd67bcOCbht+trzn0fTCs8xIetll80T9+mLtLvmX3Z15oWXp6Xkami/7dhurymujKEDfjqzOhvUcD2S5qQGdq4gCThz+d5fp34hXF+k/YqnoCFNoVU3NX6LpRX+9osKN5HwuxM0bbwyGu+HJw5Tte+WQuVvr6lG/fF7VjBjh/MdC573A9NDeNHWDH6+O+I77j5+JUWu7lnt7q69meLrzFNKkvGHCXOBb09Q6xR9PoQTo+74jPgPiONpZtYWCYFDN6/98NDzxfmYh3xPTyG1caA+EHZ2TamvtWkc1CLZjswrr5lZ2JwvC789wDqwK7joZTzCxiGBRmBL2JEo1/Sf9+kLLPivd79OLLDD7kwYXMduvcKVkvPJLbLjvRNxe8PnbdjspUOz1vkgealeZNdLvs9Jr3vHWNCehmIbXLoJ6bY75vtNFkMlI0XV5Pny1DScW/DCk2S2zeQcTv0fGdrfsaHHZjn6427NQOOeZZY10pVvrbM0EmHL/Rp84HRvRxDLrWeuhbX21Dcr9S6JhrevQOz6mLwRfeSgg+dgssmmD84yxT+wypN+sPoPmrmQATn3dIPWiw46MsiiL0jjwno/ymmM8DQe5fxxp3flrfta2lXZYRF+/V2XLrKGdDI3fqQiiuk7CPJg5zXtPWjGcoJJP+OD8jzUk9sboqrmfxAe/0IYYV95kGdZH+ZZJPT7Cz/8Zs+5wNhiP1DsE7EHUfanBYrdG8CVrsgCwZpevqBvat/XXfFQWxdzxOg81Mjexjx4GrH0tCV6pjvVFeVcd6nNTQHjas7s5cSpS/Jg5NmTDYvvOQ78MjcX7F2a8T/cI885QBNG4S7mhxOVqygVm+I1zdQAa0InsbgR2Sl6lMt7Op3knsN8V8bjLSBROcv5rpcVjFbSz619HGFdtqSqt0g3spNmr94zkGQPcuK2sIxJ+YuPzGJ3LZMIfL+/UxmuuhfjnZ9Ise4lkx1PvRc7vCa/bhM/qE9I7ePlRBUCzeUQSSOgXlS7yuHTkVfG1vvSeFvr6DGcO7Y67x9tH8GfR3xaGoyigUhto6dnQfq9NGf3EiCPFS4XS89TU//2btaR3E2cyw8GYTppsuOWJ0BF47GJ7zMnPgBMuhRPVO9H0o8FPMHAM7IOcgb8yIS0qpEw/snsO+PYf917Yz5WcasZvwGcOUYXbMF1F7VVQaHtDVPOw605cng4Js003d8k2Lb3MfLw6u2hkloopbMnmA8bk5lmHXUHytCB0+y929Mvj6ZyyOEOmd98XlHekaVA5KiHcg8jKirVS5l31jf8OpEqZPZ3OqnbJb6Rv7WEf2tP54MVxeG4ml78+FJg22dW9Hv/eFLohwl59ZkOm0wuNrqpou7T3a0SvmWGYMM9iFLVdJJffoJuapN0PVDeRuMVHsROhBpbyEINR6/w7G6Uvhf3xUH2KgbxcTPgjOcNG3Dre3yzLgbREZ98MdtphgeHezt4H98VJ0Xp86PGVsf/u2/fUHvtVEebJc1NIZlkenmrNS+bZh/K7YGXpobej4RY6K+X4TReod0lVa3lFxh//KdKdGzC/tQxrARMWO6iPxW7lQtsfwxKzU24bbxVhTIMRt2OPb8JEvxEgG8IHEukewjEL3rqira7I6uRz0xqXZWD3MWV7GyA7Ej8wZY7rvRpNF+vE8euvz8DPvBMu80JSJm7ZUt/3a7pJJ0EHN4h0AYq6CZg6Lz/r83AdHAh8d8/fuZM5200Yj1b+rcfJgW6WXPVvK95jloLSau6m30eOgPjsZCaJf3u7p1sa8bHN1SYX01bi+xufnWUdfbzQIQZpjReG5LwfX72d8wfjxnaR4h9SDPAe1hHeI+UwpTQLCv+W13Ob9+EiP7dvJiJcth426qa91WHfT8fPhqnruYiV3Tb5hxHX0sbNsRZ1qvnsHMw6JHfq+ccs+Xk92y6NXzLPOGm5yWvl2XqnlHtsc+O3rDD5fiojvqLWT7UySdzR6MAProAT0DkXsdwkERY1bR3/WbqYLp9gfmugw8/IbR2U5TM8rdzYaKLSu0FpWyy54JSieX+Bg4OpHs3FMY96z5Vj+LJponjzIJO4n/SHulT3Mi+8H/UwCceVk9E7U+Bd+SkJQXL0TlXfUeYfUD3Ku1VPA/3zu0HHmjU/9eWl0tzYGHEbA+YzhVqwVvyliRlxnaAhwJy/xZmeOdo7qbdv0ofe6PPTn+2w92xtE7+w4zNzzYmDP19hpEo827VWz9Q7o7UMzXE798Qdp5SIQq8c7MXFHxJKEkRjYzbzsHkePdmI0Ci5WMAFfwEhxBavCQBs2Lc0JhsKmkC8vTVLneHn69SY/1jjR7ScT30k2/sVPMZV3IKE1S3Nf4R0E8qCIn1Dc34XOGml9fIY9Q/in3YBlgw2+j48jkzt9ZG+rMVjPczggHPdavj249SAjnUrITBHJO8msWSjKtiyiM2r7VQT9FLwT93ehKVb41VTbA+P57Q4KNiImRLsz8X0uwL+I9fLu4PPvhur9nK59vTYkyzu6nMUjKLWFeofIdfRU07HVipX2WfRTd9rH96GR3we0ESzWPV8xv3s9IAXbtTX/RHpHtR/x7wdhBF0d3gFoYl/LCzdca/zbAjuea4Vrg5+eCIt1JYSdlvNOFNypCHI2n3dUMIi34/NO5PyPj1l93olGJK3CO/Jt3hKtaGVJcerts8T2CR8krSxXK44VEtdd8dfEwhhK+BcWWCTnqtoGghckeZDoe4OCc2Q6EQwhOY//fpMSd5fdEBF3F1ou21dXsavOO9Ht69QcV+9Aq/IO+QCN1DGM3GeB4mckv/tIqXACmYO02EEqdvhEEVCjNKsJyPZl7EjPqNiROEKLnSj7LFB5R/6gtF/lIHnSENBCpHck7MjtV0QwJunkeEe0/HPxzk+md+TbkY2jk+Yd+Fl5B2RDVLN4RyoUh3dIXpYQFDW1Pu9oi6AEeeeq6B3NAwSM6KvKOxLukuQd1Hq8QyXEOyQvU+lYKOqNCfoP0jsRRpVLOtI6/IfqHZJ3SF7WQRBqPd6JNo7xeeeq6x09jP8vAAAA//+klDjNAAAABklEQVQDAHStduEt954IAAAAAElFTkSuQmCC";

  // 2014 DMG-style CR -> XP table (verified against DMG p.275), used only for
  // the rough difficulty estimate. Keyed by numeric CR value so both "1/8"
  // and "0.125" style entry resolve to the same lookup.
  const CR_XP = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000
  };
  function parseCR(raw) {
    if (!raw) return null;
    const s = String(raw).trim();
    if (s.includes("/")) {
      const [n, d] = s.split("/").map(Number);
      if (!d || isNaN(n)) return null;
      return n / d;
    }
    const v = parseFloat(s);
    return isNaN(v) ? null : v;
  }
  function crToXP(raw) {
    const v = parseCR(raw);
    return v !== null && CR_XP[v] !== undefined ? CR_XP[v] : null;
  }

  // Per-character XP thresholds by level: [Easy, Medium, Hard, Deadly].
  const XP_THRESHOLDS = {
    1: [25, 50, 75, 100],
    2: [50, 100, 150, 200],
    3: [75, 150, 225, 400],
    4: [125, 250, 375, 500],
    5: [250, 500, 750, 1100],
    6: [300, 600, 900, 1400],
    7: [350, 750, 1100, 1700],
    8: [450, 900, 1400, 2100],
    9: [550, 1100, 1600, 2400],
    10: [600, 1200, 1900, 2800],
    11: [800, 1600, 2400, 3600],
    12: [1000, 2000, 3000, 4500],
    13: [1100, 2200, 3400, 5100],
    14: [1250, 2500, 3800, 5700],
    15: [1400, 2800, 4300, 6400],
    16: [1600, 3200, 4800, 7200],
    17: [2000, 3900, 5900, 8800],
    18: [2100, 4200, 6300, 9500],
    19: [2400, 4900, 7300, 10900],
    20: [2800, 5700, 8500, 12700]
  };
  const MULTIPLIER_ROWS = [1, 1.5, 2, 2.5, 3, 4];
  function multiplierRowIndex(monsterCount) {
    if (monsterCount <= 1) return 0;
    if (monsterCount === 2) return 1;
    if (monsterCount <= 6) return 2;
    if (monsterCount <= 10) return 3;
    if (monsterCount <= 14) return 4;
    return 5;
  }
  function computeDifficulty(enemies, partyLevel, partyCount) {
    const withCr = enemies.filter(e => crToXP(e.cr) !== null);
    if (withCr.length === 0 || !partyLevel || partyCount <= 0) return null;
    const rawXP = withCr.reduce((sum, e) => sum + crToXP(e.cr), 0);
    let idx = multiplierRowIndex(enemies.length);
    if (partyCount <= 2) idx = Math.min(idx + 1, MULTIPLIER_ROWS.length - 1);
    if (partyCount >= 6) idx = Math.max(idx - 1, 0);
    const multiplier = MULTIPLIER_ROWS[idx];
    const adjustedXP = Math.round(rawXP * multiplier);
    const perChar = XP_THRESHOLDS[clamp(partyLevel, 1, 20)];
    const [easy, medium, hard, deadly] = perChar.map(n => n * partyCount);
    let band = "Trivial";
    if (adjustedXP >= deadly) band = "Deadly";else if (adjustedXP >= hard) band = "Hard";else if (adjustedXP >= medium) band = "Medium";else if (adjustedXP >= easy) band = "Easy";
    return {
      band,
      adjustedXP,
      rawXP,
      multiplier,
      easy,
      medium,
      hard,
      deadly,
      missingCr: enemies.length - withCr.length
    };
  }
  const STATE_KEY = "dndTracker.state.v3";
  const ENCOUNTERS_KEY = "dndTracker.encounters.v3";
  const PARTIES_KEY = "dndTracker.parties.v3";
  const ENEMY_TEMPLATES_KEY = "dndTracker.enemyTemplates.v1";
  const NPC_TEMPLATES_KEY = "dndTracker.npcTemplates.v1";
  function makeDefaultAdvanced() {
    return {
      ac: "",
      armorType: "",
      size: "",
      creatureType: "",
      speed: "",
      burrow: "",
      climb: "",
      fly: "",
      swim: "",
      languages: "",
      abilities: {
        str: "",
        dex: "",
        con: "",
        int: "",
        wis: "",
        cha: ""
      },
      skills: "",
      senses: "",
      immunities: "",
      resistances: "",
      vulnerabilities: "",
      conditionImmunities: "",
      traits: [{
        name: "",
        desc: ""
      }],
      actions: [{
        name: "",
        desc: ""
      }],
      reactions: [{
        name: "",
        desc: ""
      }],
      bonusActions: [{
        name: "",
        desc: ""
      }],
      legendaryActions: [{
        name: "",
        desc: ""
      }],
      lairActions: [{
        name: "",
        desc: ""
      }]
    };
  }
  function hasAdvancedInfo(adv) {
    if (!adv) return false;
    if (adv.ac || adv.armorType || adv.size || adv.creatureType) return true;
    if (adv.speed || adv.burrow || adv.climb || adv.fly || adv.swim || adv.languages) return true;
    if (adv.abilities && Object.values(adv.abilities).some(v => v)) return true;
    if (adv.skills || adv.senses || adv.immunities || adv.resistances || adv.vulnerabilities || adv.conditionImmunities) return true;
    if (adv.traits && adv.traits.some(t => t.name || t.desc)) return true;
    if (adv.actions && adv.actions.some(a => a.name || a.desc)) return true;
    if (adv.reactions && adv.reactions.some(r => r.name || r.desc)) return true;
    if (adv.bonusActions && adv.bonusActions.some(r => r.name || r.desc)) return true;
    if (adv.legendaryActions && adv.legendaryActions.some(r => r.name || r.desc)) return true;
    if (adv.lairActions && adv.lairActions.some(r => r.name || r.desc)) return true;
    return false;
  }
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return fallback;
  }
  function initVal(c) {
    return c.initiative === null || c.initiative === undefined ? -Infinity : c.initiative;
  }

  // ---- Linked creatures (e.g. a rider and its mount share one turn) ----
  // A "child" carries `linkedTo: <parentId>`. For turn purposes a parent and its
  // children form one "unit": they act on the parent's initiative, stay together
  // in the order, and rotate to the bottom together on End Turn.
  function isAttachedChild(c, byId) {
    if (!c.linkedTo) return false;
    const parent = byId.get(c.linkedTo);
    // Only valid if the parent exists and is not itself a child (no chains/cycles).
    return !!parent && !parent.linkedTo;
  }
  function buildUnits(list) {
    const byId = new Map(list.map(c => [c.id, c]));
    const units = [];
    list.forEach(c => {
      if (isAttachedChild(c, byId)) return;
      const kids = list.filter(k => k.linkedTo === c.id && isAttachedChild(k, byId));
      units.push([c, ...kids]);
    });
    return units;
  }

  // Children mirror their parent's initiative (and roll flag) at all times.
  function syncLinkedInitiative(list) {
    const byId = new Map(list.map(c => [c.id, c]));
    return list.map(c => {
      if (!isAttachedChild(c, byId)) return c;
      const p = byId.get(c.linkedTo);
      return {
        ...c,
        initiative: p.initiative,
        autoRolled: p.autoRolled
      };
    });
  }

  // Detach a child. A player left with no initiative falls back to the default 10.
  function releaseChild(c) {
    const {
      linkedTo,
      ...rest
    } = c;
    if (rest.type === "player" && (rest.initiative === null || rest.initiative === undefined)) rest.initiative = 10;
    return rest;
  }

  // Drop links whose parent no longer exists (after removals / Clear).
  function clearOrphanLinks(list) {
    const ids = new Set(list.map(c => c.id));
    return list.map(c => c.linkedTo && !ids.has(c.linkedTo) ? releaseChild(c) : c);
  }

  // When a creature dies, its link breaks: the dead one leaves the pair and any
  // survivor becomes an ordinary combatant at the position it already held.
  function breakLinksOnDeath(list, deadId) {
    return list.map(c => {
      if (c.id === deadId && c.linkedTo) {
        const {
          linkedTo,
          ...rest
        } = c;
        return rest;
      }
      if (c.linkedTo === deadId) return releaseChild(c);
      return c;
    });
  }

  // Advance one creature's condition/concentration counters by a round.
  function tickCreature(c) {
    const conditions = (c.conditions || []).map(cond => {
      const elapsed = cond.elapsed + 1;
      const expired = cond.expired || cond.limit != null && elapsed >= cond.limit;
      return {
        ...cond,
        elapsed,
        expired
      };
    });
    const conc = c.concentration || INACTIVE_CONCENTRATION;
    const concentration = conc.active ? {
      ...conc,
      elapsed: conc.elapsed + 1,
      expired: conc.expired || conc.limit != null && conc.elapsed + 1 >= conc.limit
    } : conc;
    return {
      ...c,
      conditions,
      concentration
    };
  }
  function sortByInitiative(list) {
    // Sort whole units by their leader's initiative so a linked pair never splits.
    return [...buildUnits(list)].sort((a, b) => initVal(b[0]) - initVal(a[0])).flat();
  }
  const TYPE_ORDER = {
    player: 0,
    npc: 1,
    enemy: 2,
    marker: 3
  };
  function setupSort(list) {
    // Sort whole units (leader + attached children) so linked pairs stay together.
    return [...buildUnits(list)].sort((ua, ub) => {
      const a = ua[0],
        b = ub[0];
      if (a.type !== b.type) return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
      return a.name.localeCompare(b.name);
    }).flat();
  }

  // Inserts a whole unit into a list of units by its leader's initiative
  // (after any equal ones), without splitting any other unit.
  function insertUnitSorted(units, unit) {
    const out = [...units];
    let idx = out.length;
    for (let i = 0; i < out.length; i++) {
      if (initVal(unit[0]) > initVal(out[i][0])) {
        idx = i;
        break;
      }
    }
    out.splice(idx, 0, unit);
    return out;
  }
  const PRESET_CONDITIONS = ["Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned"];
  function makeCondition(name, limit) {
    return {
      id: uid(),
      name,
      limit: limit === undefined ? null : limit,
      elapsed: 0,
      expired: false,
      carriedOver: false
    };
  }
  const INACTIVE_CONCENTRATION = {
    active: false
  };
  function makeConcentration(limit) {
    return {
      active: true,
      limit: limit === undefined ? null : limit,
      elapsed: 0,
      expired: false,
      carriedOver: false
    };
  }

  // Old saves stored conditions as plain strings and concentration as a bare
  // boolean; upgrade both in place so the rest of the app can assume the
  // richer {limit, elapsed, expired, carriedOver} shape everywhere.
  function normalizeCombatant(c) {
    let next = c;
    if (next.conditions && next.conditions.some(cond => typeof cond === "string")) {
      next = {
        ...next,
        conditions: next.conditions.map(cond => typeof cond === "string" ? makeCondition(cond, null) : cond)
      };
    }
    if (typeof next.concentration === "boolean") {
      next = {
        ...next,
        concentration: next.concentration ? makeConcentration(null) : INACTIVE_CONCENTRATION
      };
    }
    return next;
  }
  function insertSorted(list, newC) {
    const arr = [...list];
    let idx = arr.length;
    for (let i = 0; i < arr.length; i++) {
      if (initVal(newC) > initVal(arr[i])) {
        idx = i;
        break;
      }
    }
    arr.splice(idx, 0, newC);
    return arr;
  }
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Strips a leading color-swatch name (e.g. "Red Skeleton" -> "Skeleton",
  // bare "Red" -> ""). Used both when re-picking a color and when deriving a
  // duplicate's base name.
  function stripLeadingColor(name) {
    const sorted = [...ENEMY_COLORS].sort((a, b) => b.name.length - a.name.length);
    for (const col of sorted) {
      if (name === col.name) return "";
      if (name.startsWith(col.name + " ")) return name.slice(col.name.length + 1);
    }
    return name;
  }

  // Turns a stored enemy name like "Red Skeleton" or "Skeleton 1" into just
  // "Skeleton" for the Duplicate button. Leaves fully custom names untouched.
  function deriveDuplicateBaseName(name) {
    let result = stripLeadingColor(name.trim());
    const m = result.match(/^(.*)\s\d+$/);
    if (m) result = m[1];
    return result;
  }

  // Finds the highest "<name> N" suffix already in use among existingNames,
  // so a repeated batch continues counting instead of restarting at 1.
  function nextStartNumber(existingNames, baseName) {
    let max = 0;
    const re = new RegExp(`^${escapeRegExp(baseName)} (\\d+)$`);
    existingNames.forEach(n => {
      const m = n.match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return max;
  }
  function StatusPill({
    status
  }) {
    const map = {
      active: null,
      unconscious: {
        text: "Unconscious",
        cls: "bg-amber-900/40 text-amber-300 border-amber-700"
      },
      stable: {
        text: "Stable",
        cls: "bg-sky-900/40 text-sky-300 border-sky-700"
      },
      dead: {
        text: "Dead",
        cls: "bg-neutral-800 text-neutral-400 border-neutral-600"
      }
    };
    const s = map[status];
    if (!s) return null;
    return /*#__PURE__*/React.createElement("span", {
      className: `text-xs px-2 py-0.5 rounded-full border ${s.cls} font-medium tracking-wide`
    }, s.text);
  }
  function DeathSaves({
    combatant,
    onUpdate
  }) {
    const {
      deathSaves
    } = combatant;
    const toggle = (kind, idx) => {
      const current = deathSaves[kind];
      const next = idx < current ? idx : idx + 1;
      const updated = {
        ...deathSaves,
        [kind]: clamp(next, 0, 3)
      };
      let status = "unconscious";
      if (updated.success >= 3) status = "stable";else if (updated.fail >= 3) status = "dead";
      onUpdate({
        deathSaves: updated,
        status
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 mt-2 text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-emerald-400 font-medium"
    }, "Success"), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => toggle("success", i),
      className: `w-3.5 h-3.5 rounded-full border-2 transition-colors ${i < deathSaves.success ? "bg-emerald-400 border-emerald-400" : "border-emerald-700"}`
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-rose-400 font-medium"
    }, "Fail"), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => toggle("fail", i),
      className: `w-3.5 h-3.5 rounded-full border-2 transition-colors ${i < deathSaves.fail ? "bg-rose-400 border-rose-400" : "border-rose-700"}`
    }))));
  }
  function ConditionRow({
    c,
    onAdd,
    onRemove,
    onClearCarriedOver,
    onStartConcentration,
    onDropConcentration,
    onClearConcentrationCarriedOver
  }) {
    const [adding, setAdding] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftLimit, setDraftLimit] = useState("");
    const [concAdding, setConcAdding] = useState(false);
    const [concDraftLimit, setConcDraftLimit] = useState("");
    const submit = () => {
      const name = draftName.trim();
      if (!name) return;
      const parsed = draftLimit.trim() === "" ? null : parseInt(draftLimit, 10);
      onAdd(name, isNaN(parsed) ? null : parsed);
      setDraftName("");
      setDraftLimit("");
      setAdding(false);
    };
    const startConcentration = () => {
      const parsed = concDraftLimit.trim() === "" ? null : parseInt(concDraftLimit, 10);
      onStartConcentration(isNaN(parsed) ? null : parsed);
      setConcDraftLimit("");
      setConcAdding(false);
    };
    const conc = c.concentration || INACTIVE_CONCENTRATION;
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-1.5"
    }, !conc.active ? /*#__PURE__*/React.createElement("button", {
      onClick: () => setConcAdding(v => !v),
      className: "flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border font-medium border-dashed border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
    }, /*#__PURE__*/React.createElement(IconSparkles, {
      className: "w-3 h-3"
    }), " Concentration") : /*#__PURE__*/React.createElement("span", {
      className: `flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border font-medium ${conc.expired ? "bg-neutral-800 text-neutral-500 border-neutral-700" : "bg-yellow-500/20 text-yellow-300 border-yellow-500"}`
    }, conc.expired ? /*#__PURE__*/React.createElement("span", {
      title: "Expired — announce it's over"
    }, /*#__PURE__*/React.createElement(IconFlag, {
      className: "w-3 h-3"
    })) : conc.carriedOver ? /*#__PURE__*/React.createElement("button", {
      onClick: onClearConcentrationCarriedOver,
      title: "Carried over from a previous fight — tap to clear"
    }, /*#__PURE__*/React.createElement(IconHelp, {
      className: "w-3 h-3"
    })) : null, /*#__PURE__*/React.createElement("span", {
      className: conc.expired ? "line-through" : ""
    }, "Concentration", conc.limit != null ? ` [${conc.elapsed}/${conc.limit}]` : conc.elapsed > 0 ? ` [${conc.elapsed}]` : ""), /*#__PURE__*/React.createElement("button", {
      onClick: onDropConcentration,
      className: "hover:text-white"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-3 h-3"
    }))), c.conditions.map(cond => /*#__PURE__*/React.createElement("span", {
      key: cond.id,
      className: `flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border ${cond.expired ? "bg-neutral-800 text-neutral-500 border-neutral-700" : "bg-violet-900/40 text-violet-300 border-violet-700"}`
    }, cond.expired ? /*#__PURE__*/React.createElement("span", {
      title: "Expired — announce it's over"
    }, /*#__PURE__*/React.createElement(IconFlag, {
      className: "w-3 h-3"
    })) : cond.carriedOver ? /*#__PURE__*/React.createElement("button", {
      onClick: () => onClearCarriedOver(cond.id),
      title: "Carried over from a previous fight — tap to clear"
    }, /*#__PURE__*/React.createElement(IconHelp, {
      className: "w-3 h-3"
    })) : null, /*#__PURE__*/React.createElement("span", {
      className: cond.expired ? "line-through" : ""
    }, cond.name, cond.limit != null ? ` [${cond.elapsed}/${cond.limit}]` : cond.elapsed > 0 ? ` [${cond.elapsed}]` : ""), /*#__PURE__*/React.createElement("button", {
      onClick: () => onRemove(cond.id),
      className: "hover:text-white"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-3 h-3"
    })))), /*#__PURE__*/React.createElement("button", {
      onClick: () => setAdding(v => !v),
      className: "text-xs rounded-full px-2 py-0.5 border border-dashed border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
    }, "+ Condition")), concAdding && /*#__PURE__*/React.createElement("div", {
      className: "mt-1.5 rounded-lg border border-neutral-700 bg-neutral-900 p-2 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: concDraftLimit,
      onChange: e => setConcDraftLimit(e.target.value),
      onKeyDown: e => e.key === "Enter" && startConcentration(),
      placeholder: "Rounds (optional)",
      inputMode: "numeric",
      className: "w-28 text-xs bg-neutral-950 border border-neutral-700 rounded px-2 py-1 outline-none focus:border-yellow-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: startConcentration,
      className: "text-xs px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-neutral-950 shrink-0"
    }, "Start"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 ml-auto"
    }, "Blank = count up")), adding && /*#__PURE__*/React.createElement("div", {
      className: "mt-1.5 rounded-lg border border-neutral-700 bg-neutral-900 p-2 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1"
    }, PRESET_CONDITIONS.map(name => /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: () => setDraftName(name),
      className: `text-xs px-2 py-0.5 rounded-full border ${draftName === name ? "border-violet-400 bg-violet-900/40 text-violet-200" : "border-neutral-700 text-neutral-400 hover:border-neutral-500"}`
    }, name))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: draftName,
      onChange: e => setDraftName(e.target.value),
      onKeyDown: e => e.key === "Enter" && submit(),
      placeholder: "Condition name",
      className: "flex-1 min-w-0 text-xs bg-neutral-950 border border-neutral-700 rounded px-2 py-1 outline-none focus:border-violet-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: draftLimit,
      onChange: e => setDraftLimit(e.target.value),
      onKeyDown: e => e.key === "Enter" && submit(),
      placeholder: "Rounds",
      inputMode: "numeric",
      className: "w-16 text-xs bg-neutral-950 border border-neutral-700 rounded px-2 py-1 outline-none focus:border-violet-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      className: "text-xs px-2 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white shrink-0"
    }, "Add")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "Leave rounds blank = count up")));
  }
  function InitiativeEditor({
    value,
    onChange
  }) {
    const display = value === null || value === undefined ? "" : value;
    const handleTyped = raw => {
      if (raw === "") {
        onChange(null);
        return;
      }
      const v = parseFloat(raw);
      onChange(isNaN(v) ? 0 : v);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onChange((value ?? 0) - 1),
      className: "w-4 h-4 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs"
    }, "−"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: "0.1",
      value: display,
      placeholder: "—",
      onFocus: e => {
        const t = e.target;
        setTimeout(() => {
          try {
            t.select();
          } catch (err) {/* unsupported */}
        }, 0);
      },
      onChange: e => handleTyped(e.target.value),
      className: "w-11 text-sm font-mono font-bold text-center bg-transparent text-neutral-200 outline-none border-b border-transparent focus:border-neutral-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => onChange((value ?? 0) + 1),
      className: "w-4 h-4 flex items-center justify-center rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs"
    }, "+"));
  }

  // Hand-drawn minimal line icons (Lucide-inspired: 24x24, currentColor stroke)
  // replacing the emoji used throughout the UI, plus vector takes on the
  // player/enemy/npc badges to sit alongside the uploaded logo mark.
  const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  function IconX({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 6 6 18M6 6l12 12"
    }));
  }
  function IconFlag({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 21V4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 4h14l-2.5 4L18 12H4"
    }));
  }
  function IconUsers({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "7",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 21v-1a6 6 0 0 1 12 0v1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17",
      cy: "8",
      r: "2.3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.2 14a5 5 0 0 1 6.8 4.5V21"
    }));
  }
  function IconClipboard({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "5",
      width: "14",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 11h6M9 15h6"
    }));
  }
  function IconScale({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v18M5 6h14M8 21h8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 6 2 12a3 3 0 0 0 6 0L5 6ZM19 6l-3 6a3 3 0 0 0 6 0l-3-6Z"
    }));
  }
  function IconSave({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 3v5h8V3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 21v-6h10v6"
    }));
  }
  function IconSparkles({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z"
    }));
  }
  function IconHelp({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2-2.4 3.7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "17",
      r: "0.6",
      fill: "currentColor",
      stroke: "none"
    }));
  }
  function IconSkull({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 512 512",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M186.521,265.189v27.578c0,4.969,4.219,9.016,9.438,9.016h23.016c5.203,0,9.422-4.047,9.422-9.016v-23.094h7.859v23.094c0,4.969,4.219,9.016,9.422,9.016h23.031c5.203,0,9.438-4.047,9.438-9.016v-23.094h7.844v23.094c0,4.969,4.219,9.016,9.438,9.016h23.016c5.203,0,9.422-4.047,9.422-9.016v-27.578c23.984-6.969,64.031-23.141,77.656-55.828c9.891-23.766,6.016-55.047-8.797-115.344C381.88,33.689,338.755,0.001,257.177,0.001S132.489,33.689,117.661,94.017c-14.828,60.297-18.719,91.578-8.797,115.344C122.474,242.048,162.521,258.205,186.521,265.189z M314.114,108.83c21.688-3.547,42.844,13.547,47.25,38.156c4.391,24.625-9.625,47.453-31.297,51.016c-21.719,3.531-42.891-13.531-47.281-38.172C278.396,135.22,292.427,112.392,314.114,108.83z M287.724,221.314h-30.547h-30.516l30.516-36.5L287.724,221.314z M153.005,146.986c4.438-24.609,25.563-41.703,47.25-38.156c21.703,3.563,35.75,26.391,31.328,51c-4.391,24.641-25.531,41.703-47.234,38.172C162.63,194.439,148.614,171.611,153.005,146.986z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M450.208,397.83c-16.391-7.25-35.656-1.156-44.484,13.516c-6.484,8.063-16.563,4.906-21.188,2.875c-3.438-1.516-39.281-17.36-81.844-36.157c36.578-16.75,66.781-30.578,72.828-33.344c16.703-7.641,28.703-11.813,39.719-2.781c9.609,12.813,27.703,17.609,43.078,10.578c17.266-7.891,24.563-27.688,16.297-44.203c-4.984-10-14.547-16.469-25.125-18.297c5.156-9.031,5.891-20.188,0.875-30.203c-8.25-16.516-28.938-23.484-46.203-15.594c-14.953,6.844-22.406,22.594-18.781,37.422c0.859,11.156-15.75,20.094-26.766,25.141c-7.688,3.516-55.188,25.672-105.969,49.172c-47.75-21.094-91.875-40.578-99.359-43.875c-16.828-7.438-27.844-13.609-27.609-27.469c4.188-15.25-3.484-31.641-18.969-38.5c-17.359-7.656-37.953-0.406-45.984,16.219c-4.859,10.063-3.969,21.219,1.328,30.203c-10.563,1.953-20.031,8.531-24.875,18.594c-8.016,16.641-0.438,36.328,16.938,44c15.047,6.641,32.484,2.078,42.094-10.047c8.453-7.766,26.234-1.234,37.297,3.688c5.781,2.547,34.063,14.813,69.359,30.172c-42.5,19.531-78.5,35.86-84.156,37.657c-3.359,1.078-6.375,1.203-9.031,0.813c-0.203-0.453-0.375-0.938-0.609-1.375c-8.234-16.516-28.938-23.5-46.203-15.594c-17.266,7.891-24.563,27.704-16.297,44.219c5,9.969,14.547,16.453,25.125,18.281c-5.141,9.031-5.875,20.203-0.891,30.203c8.281,16.516,28.953,23.5,46.219,15.609c16.313-7.484,23.703-25.531,17.531-41.406c-2.344-9.906,6.609-15.344,11.203-17.453c4.109-1.859,54.563-24.969,107.266-49.094c57.578,25.172,115.453,50.719,121.984,54.61c3,1.781,5.031,3.922,6.406,6.125c-0.25,0.438-0.5,0.859-0.719,1.313c-8.016,16.625-0.453,36.297,16.938,44c17.375,7.656,37.953,0.406,45.984-16.219c4.844-10.047,3.953-21.219-1.328-30.188c10.563-1.969,20.016-8.563,24.875-18.594C475.177,425.205,467.599,405.501,450.208,397.83z"
    }));
  }
  function IconD20({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 800 800",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M386.85 32.37C388.58 36.66 387.51 43.12 387.51 47.85C387.51 59.3 387.51 70.75 387.51 82.19C387.51 121.63 388.12 161.12 387.47 200.55C381.59 202.41 374.06 201.59 367.85 201.73C354.95 202.01 342.04 202.14 329.13 202.54C283.36 203.96 237.55 203.97 191.78 205.54C174.02 206.14 156.22 206.35 138.45 206.74C131.64 206.89 119.89 208.55 113.81 206.39C204.82 148.38 295.83 90.38 386.85 32.37ZM413.15 32.37C504.03 90.38 594.92 148.38 685.8 206.39C680.88 208.49 669.48 206.91 663.74 206.8C646.94 206.47 630.13 206.18 613.33 205.72C566.34 204.45 519.31 204.11 472.33 202.59C458.94 202.15 445.54 202.04 432.15 201.73C425.94 201.58 418.42 202.41 412.53 200.55C411.88 161.12 412.49 121.63 412.49 82.19C412.49 70.75 412.49 59.3 412.49 47.85C412.49 43.12 411.42 36.66 413.15 32.37ZM377.4 226.85C317.73 329.13 258.06 431.42 198.39 533.7C193.61 523.9 190.33 512.88 186.66 502.61C179.66 483 172.13 463.54 164.82 444.05C159.69 430.36 154.13 416.93 148.6 403.42C146.54 398.39 145.45 392.9 143.72 387.74C141.01 379.66 137.9 371.64 134.85 363.69C118.22 320.43 102.95 276.64 86.19 233.42C93.26 231.02 108.51 232.21 116.53 232.07C136.99 231.72 157.44 231.22 177.9 230.86C223.93 230.06 269.95 228.61 315.98 227.89C330.11 227.67 344.23 227.19 358.36 226.97C364.47 226.87 371.41 225.76 377.4 226.85ZM713.06 233.42C676.17 333.4 639.27 433.37 602.37 533.34C597.87 529.89 590.95 514.99 587.63 509.35C575.96 489.57 564.32 469.77 552.8 449.9C523.06 398.65 493.22 347.4 462.92 296.48C453.74 281.04 444.79 265.46 435.67 249.99C432.14 244.01 424.08 233.05 422.6 226.85C428.59 225.76 435.53 226.88 441.64 226.97C455.77 227.18 469.89 227.68 484.02 227.9C530.05 228.61 576.07 230.08 622.1 230.87C642.56 231.21 663.01 231.75 683.47 232.08C691.24 232.21 706.25 231.06 713.06 233.42ZM400 239.06C460.92 343.04 521.84 447.02 582.76 551C461 551 339.23 551 217.47 551C278.31 447.02 339.16 343.04 400 239.06ZM81.15 292.19C113.29 378.78 145.42 465.37 177.56 551.96C145.42 554.94 113.29 557.92 81.15 560.9C81.15 471.33 81.15 381.76 81.15 292.19ZM718.84 292.19C718.84 381.76 718.84 471.33 718.84 560.9C686.78 557.92 654.71 554.94 622.65 551.96C623.48 543.97 628.94 533.96 631.71 526.19C638.5 507.08 645.97 488.22 652.82 469.14C666.75 430.32 680.92 391.34 695.84 352.84C700.69 340.31 705.15 327.62 709.82 315.02C712.56 307.62 714.54 298.78 718.84 292.19ZM575.34 576.26C516.89 640.1 458.45 703.95 400 767.79C341.39 704.13 282.78 640.47 224.17 576.8C227.83 574.45 243.53 575.98 248.77 575.98C270.68 575.98 292.6 575.98 314.52 575.98C373.21 575.98 431.9 575.98 490.59 575.98C509.35 575.98 528.1 575.98 546.85 575.98C555.98 575.98 566.39 574.61 575.34 576.26ZM324.02 722.58C251.84 676.67 179.66 630.75 107.48 584.84C110.01 582.5 123.25 582.38 127.49 582.09C143.09 581.03 158.63 578.87 174.25 577.97C178.27 577.74 187.21 575.56 190.65 576.85C192.84 577.67 197.36 583.89 199.2 585.84C207.35 594.48 215.32 603.33 223.3 612.13C246.56 637.81 270.07 663.27 293.5 688.79C300.61 696.54 307.77 704.25 314.85 712.02C317.67 715.11 322.5 718.74 324.02 722.58ZM692.52 584.84C667.8 599.73 644 616.22 619.65 631.68C592.11 649.18 564.51 666.58 537.1 684.33C522.89 693.52 508.48 702.41 494.29 711.64C490.28 714.24 480.36 722.09 476.23 722.19C494.28 701.3 513.93 681.78 531.9 660.83C534.04 658.35 536.82 656.48 539.02 654.09C550.91 641.17 562.55 627.94 574.45 614.99C582.72 605.99 591.11 597.06 599.26 587.94C601.26 585.71 607.44 577.48 609.9 576.77C613.32 575.79 618.64 577.27 622.13 577.67C629.75 578.54 637.43 578.91 645.06 579.73C656.38 580.94 667.77 581.71 679.11 582.77C682.87 583.12 689.83 582.35 692.52 584.84Z"
    }));
  }
  function IconLibrary({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "4",
      width: "4",
      height: "16",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "10",
      y: "6",
      width: "4",
      height: "14",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "16",
      y: "3",
      width: "4",
      height: "17",
      rx: "1"
    }));
  }
  function IconBookOpen({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 6a5 5 0 0 0-5-3H3v15h4a5 5 0 0 1 5 3 5 5 0 0 1 5-3h4V3h-4a5 5 0 0 0-5 3Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 6v15"
    }));
  }
  function IconSettings({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z"
    }), /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867ZM10.3338 3.24375C10.4149 2.83334 10.7983 2.5 11.2867 2.5H12.7136C13.2021 2.5 13.5855 2.83336 13.6666 3.24378L13.7456 3.64379C14.1791 5.83811 16.4909 7.09167 18.5935 6.38353L18.9905 6.24984C19.4495 6.09527 19.9394 6.28595 20.1637 6.66264L20.8771 7.86064C21.0946 8.22587 21.0208 8.69271 20.6764 8.98135L20.3586 9.24773C18.6325 10.6943 18.6325 13.3057 20.3586 14.7523L20.6764 15.0186C21.0208 15.3073 21.0946 15.7741 20.8771 16.1394L20.1637 17.3373C19.9394 17.714 19.4495 17.9047 18.9905 17.7501L18.5936 17.6164C16.4909 16.9082 14.1791 18.1618 13.7456 20.3562L13.6666 20.7562C13.5855 21.1666 13.2021 21.5 12.7136 21.5H11.2867C10.7983 21.5 10.4149 21.1667 10.3338 20.7562L10.2547 20.356C9.82113 18.1617 7.50931 16.9082 5.40665 17.6165L5.0099 17.7501C4.55092 17.9047 4.06104 17.714 3.83671 17.3373L3.1233 16.1393C2.9058 15.7741 2.97959 15.3073 3.32398 15.0186L3.64185 14.7522C5.36782 13.3056 5.36781 10.6944 3.64185 9.24779L3.32398 8.98137C2.97959 8.69273 2.9058 8.2259 3.1233 7.86067L3.83674 6.66266C4.06106 6.28596 4.55093 6.09528 5.0099 6.24986L5.40676 6.38352C7.50938 7.09166 9.82112 5.83819 10.2547 3.64392L10.3338 3.24375Z"
    }));
  }
  function IconTrash({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 7h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 11v6M14 11v6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
    }));
  }
  function IconRotateCcw({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 12a9 9 0 1 0 3-6.7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 3v5h5"
    }));
  }
  function IconToolbox({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "8",
      width: "18",
      height: "12",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 13h18"
    }));
  }
  function IconDownload({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v12"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 10l5 5 5-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 20h16"
    }));
  }
  function IconUpload({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 21V9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 14l5-5 5 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 20h16"
    }));
  }
  function IconRewind({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 16 16",
      fill: "currentColor",
      "aria-hidden": "true",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z"
    }));
  }
  function IconUndo({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 14 4 9l5-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 9h10a6 6 0 0 1 0 12h-2"
    }));
  }
  function IconChevronDown({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 9l6 6 6-6"
    }));
  }
  function IconChevronUp({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 15l6-6 6 6"
    }));
  }
  function IconChevronRight({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    }));
  }
  function IconShield({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 6C20 6 19.1843 6 19.0001 6C16.2681 6 13.8871 4.93485 11.9999 3C10.1128 4.93478 7.73199 6 5.00009 6C4.81589 6 4.00009 6 4.00009 6C4.00009 6 4 8 4 9.16611C4 14.8596 7.3994 19.6436 12 21C16.6006 19.6436 20 14.8596 20 9.16611C20 8 20 6 20 6Z"
    }));
  }
  function IconSwords({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 -0.05 87.686 87.686",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M472.334,146.1l-3.381,3.162-2.83-2.828,4.464-4.464a2,2,0,0,0-2.827-2.829l-4.466,4.464-2.835-2.835,3.555-3.817a2,2,0,1,0-2.928-2.725v0l-3.456,3.714-2.926-2.926-6.778.675-.674,6.776,4.829,4.829-7.231,8.924-.049,0a8.711,8.711,0,0,0,0,17.422h.007a8.693,8.693,0,0,0,6.151-2.551l-1.412-1.414,1.414,1.414a8.7,8.7,0,0,0,2.549-6.161c0-.017,0-.034,0-.05l8.925-7.229,4.828,4.828,6.778-.675.673-6.778-.67-.668-2.26-2.261,3.285-3.073a2,2,0,0,0-2.733-2.92Zm-24.2,22.159a4.711,4.711,0,1,1-3.331-8.042,4.782,4.782,0,0,1,.746.071c.143.024.284.059.424.094s.259.07.387.115.252.093.375.148a4.526,4.526,0,0,1,.446.235c.093.054.189.1.278.166a4.642,4.642,0,0,1,.642.524l.032.026c.008.009.014.019.023.028a4.881,4.881,0,0,1,.526.643c.064.094.116.193.172.29.083.141.161.285.229.432.056.128.107.258.152.389s.077.242.108.364c.038.148.076.3.1.448a4.919,4.919,0,0,1,.071.736,4.688,4.688,0,0,1-1.381,3.332Zm4.251-7.617c-.021-.038-.051-.072-.073-.111a8.6,8.6,0,0,0-.48-.732c-.05-.07-.1-.139-.152-.207a8.54,8.54,0,0,0-.717-.825,8.769,8.769,0,0,0-.822-.715c-.07-.055-.142-.1-.214-.157a8.577,8.577,0,0,0-.731-.479c-.037-.022-.071-.051-.109-.072l1.845-2.276,3.729,3.73Zm5.4-4.376-4.322-4.322,1.463-1.806,1.759,1.76,2.9,2.906Zm12.6,1.878-1.633.162-3.191-3.191h0l-7.3-7.3-6.842-6.842.161-1.631,1.634-.162,12.156,12.156,3.489,3.489h0l1.685,1.685Zm15.906-44.963,21.46-22.93,8.02.879-25.512,25.512a2,2,0,1,0,2.828,2.828l25.491-25.49.9,8L496.96,123.047a2,2,0,0,0,2.732,2.922l23.983-22.447L521.9,87.773,506.2,86.05l-22.829,24.394a2,2,0,1,0,2.922,2.732Zm28.575,43.035-.049,0-7.232-8.924,4.829-4.829-.676-6.776-6.778-.675-2.928,2.928L453.466,86.05l-15.705,1.724-1.772,15.749,51.893,48.565-2.93,2.931.1.942.578,5.834,6.78.675,4.827-4.827,8.924,7.23c0,.016,0,.032,0,.048a8.71,8.71,0,0,0,8.71,8.712h.008a8.711,8.711,0,0,0-.008-17.422ZM451.915,90.245,499.2,140.768,496.37,143.6,443.895,91.125ZM440.19,101.974l.9-8,52.452,52.452-2.829,2.83Zm53.915,53.135h0l-3.191,3.191-1.634-.162-.161-1.632,17.329-17.329,1.633.162.163,1.631-8.666,8.666Zm5.97-.31,4.665-4.666,1.463,1.806-4.323,4.323Zm9.448,3.25a8.7,8.7,0,0,0-.818.713h0l0,0a8.557,8.557,0,0,0-.708.812c-.059.075-.113.152-.168.228-.168.232-.324.469-.467.713-.024.04-.055.077-.078.118l-2.276-1.844,3.73-3.73,1.845,2.276c-.038.021-.071.049-.108.071a8.691,8.691,0,0,0-.729.478C509.669,157.941,509.6,157.993,509.523,158.049Zm8.671,10.2a4.678,4.678,0,0,1-7.97-4.068,4.413,4.413,0,0,1,.1-.442c.032-.126.068-.252.111-.375s.094-.255.149-.38a4.686,4.686,0,0,1,.233-.443c.055-.094.106-.19.168-.281a4.694,4.694,0,0,1,.55-.673l.005-.005a4.889,4.889,0,0,1,.669-.546c.09-.061.186-.111.279-.166a4.832,4.832,0,0,1,.445-.234c.124-.055.25-.1.377-.148s.255-.081.384-.114.282-.071.427-.1a4.757,4.757,0,0,1,.745-.071,4.709,4.709,0,0,1,3.33,8.041Z",
      transform: "translate(-435.989 -86.05)"
    }));
  }
  function IconMask({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 512 512",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M293.686,333.324c5.976,52.529,58.497,59.684,74.014,59.684c15.521,0,68.042-7.155,74.01-59.684c-9.545,8.358-40.582,22.691-74.01,22.691C334.276,356.014,303.239,341.681,293.686,333.324z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M312.681,272.069c12.31,1.33,23.671,5.338,33.591,11.37c0.394-17.695-12.824-33.041-30.747-34.969c-17.827-1.92-33.926,10.126-37.423,27.344C288.894,272.189,300.622,270.778,312.681,272.069z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M389.129,283.439c9.919-6.032,21.285-10.039,33.587-11.37c12.067-1.291,23.786,0.12,34.579,3.745c-3.498-17.218-19.596-29.264-37.42-27.344C401.948,250.398,388.73,265.744,389.129,283.439z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M511.724,171.919c0,0-0.02-0.216-0.036-0.327l-0.02-0.104l-0.02-0.144c-0.948-6.86-5.975-12.389-13.05-13.106c-5.765-0.59-11.586,2.35-17.119,3.673c-11.405,2.693-22.97,4.74-34.535,6.462c-30.085,4.478-60.56,6.549-90.964,5.832c-23.604-0.55-47.223-2.621-70.552-6.278c-8.7-36.101-23.006-95.259-27.058-112.023c-0.82-3.402-1.43-8.724-8.29-3.792c-4.96,3.593-54.665,28.874-118.249,44.243C68.247,111.724,12.475,111.916,6.42,111c-8.346-1.275-6.466,3.744-5.641,7.146C5.133,136.16,21.294,203.039,29.7,237.777c20.496,84.87,111.994,128.117,164.213,115.489c11.242-2.717,22.918-8.573,34.125-16.939c11.282,46.108,43.136,86.902,84.714,109.784c13.413,7.378,28.077,12.979,43.311,15.027c14.935,2.023,29.942-0.167,44.14-5.02c27.938-9.56,52.665-28.213,71.624-50.649c18.481-21.886,31.731-48.227,37.172-76.408c2.506-12.964,2.848-25.934,2.848-39.073V186.977C511.848,182.029,512.262,176.842,511.724,171.919z M61.156,185.351c11.358,0.972,23.082-0.398,34.487-4.493c11.656-4.176,21.776-10.733,29.99-18.932c4.534,17.098-4.705,35.129-21.679,41.2C87.086,209.182,68.606,201.262,61.156,185.351z M223.564,256.612c-13.808-2.852-33.539-3.991-52.84,0.685c-28.596,6.908-52.18,25.576-58.625,34.691c-5.744-46.156,37.694-63.134,50.98-66.354c10.202-2.47,40.001-5.832,60.485,12.629V256.612z M231.835,159.648c-1.932,3.928-4.581,7.466-7.844,10.406c-5.008,4.526-11.405,7.633-18.6,8.581c-17.875,2.327-34.324-9.489-38.108-26.794c11.07,3.554,23.046,4.764,35.328,3.171c12.019-1.57,23.082-5.705,32.734-11.76C235.564,149.083,234.289,154.677,231.835,159.648z M488.574,284.937c0,12.708,0.16,25.337-2.079,37.91c-1.933,10.867-5.247,21.448-9.72,31.519c-0.056,0.104-0.112,0.231-0.164,0.358c-0.015,0.048-0.055,0.104-0.071,0.175c-0.088,0.183-0.164,0.374-0.251,0.557c-0.159,0.374-0.339,0.749-0.518,1.14c0.048-0.144,0.123-0.263,0.179-0.415c-11.354,24.644-29.67,46.164-51.892,61.66c-12.302,8.589-26.109,15.593-40.813,18.939c-13.732,3.155-27.284,1.825-40.57-2.701c-27.826-9.506-52.032-29.814-69.01-53.526c-13.286-18.564-22.277-40.076-25.496-62.576c-0.88-6.103-1.326-12.302-1.326-18.516V184.149c14.274,3.513,28.83,6.102,43.438,8.07c9.314,1.275,18.676,2.295,27.986,3.14c31.193,2.805,62.548,2.964,93.757,0.43c25.66-2.079,51.514-5.497,76.551-11.656V284.937z"
    }));
  }
  function IconStop({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      ...svgProps,
      className: className
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "5",
      width: "14",
      height: "14",
      rx: "2"
    }));
  }
  function IconChain({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 512 512",
      fill: "currentColor",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      d: "M278.172,297.375l-51.203,51.188c0.016,0.594,0.031,1.188,0.031,1.781c0,8.406-1.594,16.781-4.766,24.625c-3.203,7.813-7.922,15.156-14.375,21.563l-33.672,33.719c-6.453,6.438-13.766,11.156-21.609,14.344c-7.859,3.188-16.219,4.781-24.609,4.781c-8.375,0-16.75-1.594-24.594-4.75c-7.844-3.219-15.156-7.938-21.625-14.375c-6.438-6.438-11.156-13.75-14.344-21.594s-4.781-16.219-4.781-24.625c0-8.375,1.594-16.75,4.781-24.594s7.906-15.156,14.344-21.625l33.719-33.688c6.438-6.406,13.734-11.156,21.594-14.344c7.828-3.188,16.219-4.781,24.594-4.781c0.594,0,1.188,0.031,1.766,0.063l51.203-51.234c-1.594-0.734-3.203-1.422-4.844-2.078c-15.422-6.25-31.781-9.375-48.125-9.375s-32.719,3.125-48.125,9.375c-15.422,6.25-29.906,15.688-42.359,28.094l-33.688,33.719c-12.438,12.406-21.859,26.906-28.109,42.344S0,367.688,0,384.031s3.125,32.719,9.375,48.156c6.25,15.406,15.672,29.906,28.109,42.313c12.422,12.469,26.922,21.906,42.344,28.125c15.438,6.281,31.797,9.375,48.141,9.375c16.359,0,32.719-3.094,48.141-9.375c15.422-6.219,29.922-15.656,42.344-28.125l33.703-33.656c12.422-12.469,21.844-26.938,28.109-42.344c6.266-15.469,9.359-31.813,9.375-48.156c-0.016-16.313-3.109-32.688-9.375-48.156C279.594,300.594,278.891,298.969,278.172,297.375z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M502.625,79.844c-6.25-15.438-15.672-29.938-28.109-42.359c-12.422-12.422-26.922-21.859-42.359-28.109C416.734,3.125,400.375,0,384.031,0s-32.719,3.125-48.141,9.375s-29.922,15.688-42.344,28.109l-33.703,33.703C247.422,83.594,238,98.094,231.734,113.531c-6.266,15.406-9.359,31.781-9.359,48.141c0,16.344,3.094,32.703,9.359,48.141c0.672,1.625,1.359,3.219,2.094,4.828l51.203-51.203c-0.016-0.578-0.031-1.156-0.031-1.766c0-8.391,1.594-16.781,4.781-24.609c3.188-7.844,7.906-15.156,14.359-21.625l33.672-33.688c6.453-6.406,13.766-11.141,21.625-14.344c7.813-3.156,16.203-4.781,24.594-4.781c8.406,0,16.75,1.625,24.625,4.781c7.813,3.203,15.141,7.938,21.594,14.344c6.438,6.469,11.156,13.781,14.344,21.625c3.156,7.844,4.781,16.219,4.781,24.594c0,8.391-1.625,16.75-4.781,24.625c-3.188,7.844-7.906,15.156-14.344,21.594l-33.688,33.688c-6.438,6.438-13.766,11.156-21.625,14.344c-7.828,3.188-16.203,4.781-24.594,4.781c-0.594,0-1.188-0.016-1.766-0.031l-51.203,51.219c1.594,0.719,3.203,1.422,4.813,2.063c15.453,6.281,31.813,9.406,48.156,9.406s32.719-3.125,48.125-9.406c15.422-6.25,29.906-15.672,42.359-28.094l33.688-33.703c12.438-12.422,21.859-26.922,28.109-42.359c6.25-15.406,9.375-31.781,9.375-48.125S508.875,95.25,502.625,79.844z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M160.219,351.781c12.234,12.25,32.063,12.25,44.281,0L351.781,204.5c12.219-12.219,12.25-32.031,0-44.281c-12.234-12.219-32.063-12.219-44.281,0L160.219,307.531C148,319.75,148,339.563,160.219,351.781z"
    }));
  }
  function IconInfo({
    className
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.5,
      className: className
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 17V11",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    }));
  }
  const TYPE_STYLE = {
    player: {
      icon: IconShield,
      border: "border-sky-800/60",
      bg: "bg-sky-950/10",
      iconBg: "bg-sky-900/40 border-sky-700 text-sky-300"
    },
    npc: {
      icon: IconMask,
      border: "border-stone-600/60",
      bg: "bg-stone-800/10",
      iconBg: "bg-stone-700/40 border-stone-500 text-stone-300"
    },
    enemy: {
      icon: IconSwords,
      border: "border-rose-900/60",
      bg: "bg-rose-950/10",
      iconBg: "bg-rose-900/40 border-rose-700 text-rose-300"
    },
    marker: {
      icon: IconFlag,
      border: "border-indigo-800/60",
      bg: "bg-indigo-950/10",
      iconBg: "bg-indigo-900/40 border-indigo-700 text-indigo-300"
    }
  };
  function TypeIcon({
    icon: IconComp
  }) {
    return /*#__PURE__*/React.createElement(IconComp, {
      className: "w-4 h-4"
    });
  }
  function AdvancedFieldsEditor({
    value,
    onChange,
    accent,
    cr,
    onCrChange
  }) {
    const [open, setOpen] = useState(false);
    const update = patch => onChange({
      ...value,
      ...patch
    });
    const updateAbility = (key, val) => onChange({
      ...value,
      abilities: {
        ...value.abilities,
        [key]: val
      }
    });
    // Older saved enemies/NPCs predate "reactions" and won't have that field,
    // so every list read falls back to a single empty row.
    const getList = field => value[field] || [{
      name: "",
      desc: ""
    }];
    const updateListItem = (field, idx, key, val) => {
      const list = getList(field).map((item, i) => i === idx ? {
        ...item,
        [key]: val
      } : item);
      onChange({
        ...value,
        [field]: list
      });
    };
    const addListItem = field => onChange({
      ...value,
      [field]: [...getList(field), {
        name: "",
        desc: ""
      }]
    });
    // Swap a row with its neighbour; the stat block shows the list in this order.
    const moveListItem = (field, idx, dir) => {
      const list = [...getList(field)];
      const j = idx + dir;
      if (j < 0 || j >= list.length) return;
      [list[idx], list[j]] = [list[j], list[idx]];
      onChange({
        ...value,
        [field]: list
      });
    };
    const removeListItem = (field, idx) => onChange({
      ...value,
      [field]: getList(field).filter((_, i) => i !== idx)
    });
    const inputCls = "text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none placeholder:text-neutral-600";
    return /*#__PURE__*/React.createElement("div", {
      className: "border-t border-neutral-800 pt-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(v => !v),
      className: `w-full flex items-center justify-between text-xs font-semibold ${accent}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(IconSettings, {
      className: "w-3.5 h-3.5"
    }), " Advanced"), /*#__PURE__*/React.createElement(IconChevronDown, {
      className: `w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`
    })), open && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Size",
      value: value.size ?? "",
      onChange: e => update({
        size: e.target.value
      }),
      className: `w-1/3 ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Type (e.g. humanoid)",
      value: value.creatureType ?? "",
      onChange: e => update({
        creatureType: e.target.value
      }),
      className: `flex-1 min-w-0 ${inputCls}`
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "AC",
      value: value.ac ?? "",
      onChange: e => update({
        ac: e.target.value
      }),
      inputMode: "numeric",
      className: `w-1/5 ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Armor type",
      value: value.armorType ?? "",
      onChange: e => update({
        armorType: e.target.value
      }),
      className: `flex-1 min-w-0 ${inputCls}`
    }), onCrChange && /*#__PURE__*/React.createElement("input", {
      placeholder: "CR",
      title: "Challenge Rating (optional) — XP is filled in from this",
      value: cr,
      onChange: e => onCrChange(e.target.value),
      inputMode: "decimal",
      className: `w-1/5 ${inputCls}`
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 mb-1"
    }, "Speeds (ft.)"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-5 gap-1"
    }, [["speed", "Walk"], ["burrow", "Burrow"], ["climb", "Climb"], ["fly", "Fly"], ["swim", "Swim"]].map(([k, label]) => /*#__PURE__*/React.createElement("input", {
      key: k,
      placeholder: label,
      value: value[k] ?? "",
      onChange: e => update({
        [k]: e.target.value
      }),
      className: `text-center px-0.5 min-w-0 ${inputCls.replace("text-sm", "text-xs")}`
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 mb-1"
    }, "Ability score modifiers"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-6 gap-1"
    }, ["str", "dex", "con", "int", "wis", "cha"].map(k => /*#__PURE__*/React.createElement("input", {
      key: k,
      placeholder: k.toUpperCase(),
      value: value.abilities[k],
      onChange: e => updateAbility(k, e.target.value),
      inputMode: "numeric",
      className: `text-center px-1 ${inputCls}`
    })))), /*#__PURE__*/React.createElement("input", {
      placeholder: "Skills (e.g. Perception +3)",
      value: value.skills,
      onChange: e => update({
        skills: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Damage vulnerabilities",
      value: value.vulnerabilities,
      onChange: e => update({
        vulnerabilities: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Damage resistances",
      value: value.resistances,
      onChange: e => update({
        resistances: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Damage immunities",
      value: value.immunities,
      onChange: e => update({
        immunities: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Condition immunities",
      value: value.conditionImmunities ?? "",
      onChange: e => update({
        conditionImmunities: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Senses (e.g. passive Perception 13)",
      value: value.senses,
      onChange: e => update({
        senses: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Languages",
      value: value.languages ?? "",
      onChange: e => update({
        languages: e.target.value
      }),
      className: `w-full ${inputCls}`
    }), [["traits", "Traits", "Trait"], ["actions", "Actions", "Action"], ["bonusActions", "Bonus Actions", "Bonus Action"], ["reactions", "Reactions", "Reaction"], ["legendaryActions", "Legendary Actions", "Legendary Action"], ["lairActions", "Lair Actions", "Lair Action"]].map(([field, title, noun]) => /*#__PURE__*/React.createElement("div", {
      key: field
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 mb-1"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, getList(field).map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex gap-1"
    }, getList(field).length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col justify-center shrink-0"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => moveListItem(field, i, -1),
      disabled: i === 0,
      "aria-label": `Move ${noun} up`,
      title: "Move up",
      className: "text-neutral-500 hover:text-neutral-200 disabled:opacity-20 disabled:hover:text-neutral-500 p-0.5"
    }, /*#__PURE__*/React.createElement(IconChevronUp, {
      className: "w-3.5 h-3.5"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => moveListItem(field, i, 1),
      disabled: i === getList(field).length - 1,
      "aria-label": `Move ${noun} down`,
      title: "Move down",
      className: "text-neutral-500 hover:text-neutral-200 disabled:opacity-20 disabled:hover:text-neutral-500 p-0.5"
    }, /*#__PURE__*/React.createElement(IconChevronDown, {
      className: "w-3.5 h-3.5"
    }))), /*#__PURE__*/React.createElement("input", {
      placeholder: "Name",
      value: it.name,
      onChange: e => updateListItem(field, i, "name", e.target.value),
      className: `w-[30%] shrink-0 min-w-0 ${inputCls}`
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Description",
      value: it.desc,
      onChange: e => updateListItem(field, i, "desc", e.target.value),
      className: `flex-1 min-w-0 ${inputCls}`
    }), getList(field).length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: () => removeListItem(field, i),
      className: "text-neutral-600 hover:text-rose-300 px-1"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-3 h-3"
    }))))), /*#__PURE__*/React.createElement("button", {
      onClick: () => addListItem(field),
      className: "text-xs text-neutral-400 hover:text-neutral-200 mt-1"
    }, "+ Add ", noun)))));
  }

  // Bare numbers get "ft." (so "30" reads "30 ft."); anything else is shown as typed.
  const fmtFt = v => /^\d+$/.test(String(v).trim()) ? `${String(v).trim()} ft.` : String(v).trim();

  // Laid out like a standard 5e stat block: size/type, AC, speed, ability scores,
  // the property lines, then traits and the action sections. Blank fields are skipped.
  function StatBlockPanel({
    advanced: a,
    cr
  }) {
    const abilityRow = Object.values(a.abilities).some(v => v);
    const subtitle = [a.size, a.creatureType].map(v => (v || "").trim()).filter(Boolean).join(" ");
    const acText = a.ac && a.armorType ? `${a.ac} (${a.armorType})` : a.ac || (a.armorType ? `(${a.armorType})` : "");
    const speedParts = [a.speed && fmtFt(a.speed), a.burrow && `burrow ${fmtFt(a.burrow)}`, a.climb && `climb ${fmtFt(a.climb)}`, a.fly && `fly ${fmtFt(a.fly)}`, a.swim && `swim ${fmtFt(a.swim)}`].filter(Boolean);
    const topLines = [["Armor Class", acText], ["Speed", speedParts.join(", ")]].filter(([, v]) => v);
    const crText = (cr || "").toString().trim();
    const xp = crText ? crToXP(crText) : null;
    const challenge = crText ? `${crText}${xp !== null ? ` (${xp.toLocaleString("en-US")} XP)` : ""}` : "";
    const propLines = [["Skills", a.skills], ["Damage Vulnerabilities", a.vulnerabilities], ["Damage Resistances", a.resistances], ["Damage Immunities", a.immunities], ["Condition Immunities", a.conditionImmunities], ["Senses", a.senses], ["Languages", a.languages], ["Challenge", challenge]].filter(([, v]) => v);
    const keep = list => (list || []).filter(t => t.name || t.desc);
    const traits = keep(a.traits);
    const sections = [["Actions", keep(a.actions)], ["Bonus Actions", keep(a.bonusActions)], ["Reactions", keep(a.reactions)], ["Legendary Actions", keep(a.legendaryActions)], ["Lair Actions", keep(a.lairActions)]].filter(([, list]) => list.length > 0);
    const entry = (t, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      className: "text-xs text-neutral-300"
    }, t.name && /*#__PURE__*/React.createElement("span", {
      className: "italic font-bold text-amber-200"
    }, t.name, "."), " ", t.desc);
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-2 rounded-lg border border-amber-900/40 bg-amber-950/10 p-3 font-serif"
    }, subtitle && /*#__PURE__*/React.createElement("div", {
      className: "text-xs italic text-neutral-400 mb-2"
    }, subtitle), topLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-neutral-300 space-y-0.5 mb-2"
    }, topLines.map(([label, val]) => /*#__PURE__*/React.createElement("div", {
      key: label
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-amber-300"
    }, label), " ", val))), abilityRow && /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-6 gap-1 text-center text-xs border-y border-amber-800/40 py-2 mb-2"
    }, ["str", "dex", "con", "int", "wis", "cha"].map(k => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-semibold text-amber-300"
    }, k.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      className: "text-neutral-300"
    }, a.abilities[k] || "—")))), propLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-neutral-300 space-y-0.5 mb-2"
    }, propLines.map(([label, val]) => /*#__PURE__*/React.createElement("div", {
      key: label
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-amber-300"
    }, label), " ", val))), traits.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5 mb-2 border-t border-amber-800/40 pt-2"
    }, traits.map(entry)), sections.map(([title, list], idx) => /*#__PURE__*/React.createElement("div", {
      key: title,
      className: `border-t border-amber-800/40 pt-2 ${idx > 0 ? "mt-2" : ""}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center text-sm font-bold text-amber-300 tracking-wide mb-1"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, list.map(entry)))));
  }
  function CombatantCard({
    c,
    isCurrent,
    inCombat,
    onUpdate,
    onRemove,
    onEndTurn,
    onInitChange,
    cardRef,
    onSetClipboard,
    onChain,
    chainState,
    isLinkedChild,
    linkedParentName,
    hideEndTurn
  }) {
    const [statBlockOpen, setStatBlockOpen] = useState(false);
    const [dmgInput, setDmgInput] = useState("");
    const [healInput, setHealInput] = useState("");
    const style = TYPE_STYLE[c.type];
    const dead = c.status === "dead";
    const isPlayer = c.type === "player";
    const isEnemy = c.type === "enemy";
    const isNpc = c.type === "npc";
    const isMarker = c.type === "marker";
    const pct = isEnemy || isNpc ? clamp(c.currentHp / c.maxHp * 100, 0, 100) : 0;
    const applyHp = delta => {
      const newHp = clamp(c.currentHp + delta, 0, c.maxHp);
      const patch = {
        currentHp: newHp
      };
      if (isEnemy) {
        let status = c.status;
        let revived = false;
        if (newHp === 0) status = "dead";else if (status === "dead") {
          status = "active";
          revived = true;
        }
        patch.status = status;
        if (revived) patch._revive = true;
      } else if (isNpc) {
        let status = c.status;
        let revived = false;
        if (newHp === 0 && c.currentHp > 0) {
          status = "unconscious";
          patch.deathSaves = {
            success: 0,
            fail: 0
          };
        } else if (newHp > 0 && status !== "active") {
          revived = status === "dead";
          status = "active";
          patch.deathSaves = {
            success: 0,
            fail: 0
          };
        }
        patch.status = status;
        if (revived) patch._revive = true;
      }
      onUpdate(patch);
    };
    const applyDamage = () => {
      const n = parseInt(dmgInput, 10);
      if (!isNaN(n) && n > 0) applyHp(-n);
      setDmgInput("");
    };
    const applyHeal = () => {
      const n = parseInt(healInput, 10);
      if (!isNaN(n) && n > 0) applyHp(n);
      setHealInput("");
    };
    const setDown = () => onUpdate({
      status: "unconscious",
      deathSaves: {
        success: 0,
        fail: 0
      }
    });
    const setAlive = () => onUpdate({
      status: "active",
      deathSaves: {
        success: 0,
        fail: 0
      },
      ...(c.status === "dead" ? {
        _revive: true
      } : {})
    });
    const isDownGroup = c.status === "unconscious" || c.status === "stable" || c.status === "dead";
    const markDead = () => onUpdate({
      currentHp: 0,
      status: "dead",
      deathSaves: {
        success: 0,
        fail: 0
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      ref: cardRef,
      className: `rounded-xl border p-3 transition-all ${dead ? "opacity-50 border-neutral-800 bg-neutral-900/40" : isCurrent ? "border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-900/20 ring-1 ring-amber-400/40" : `${style.border} ${style.bg}`}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: `flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 relative text-sm ${style.iconBg}`
    }, /*#__PURE__*/React.createElement(TypeIcon, {
      icon: isLinkedChild ? IconChain : style.icon
    }), c.color && /*#__PURE__*/React.createElement("span", {
      className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-neutral-950",
      style: {
        backgroundColor: c.color
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `font-semibold truncate ${dead ? "line-through text-neutral-500" : "text-neutral-100"}`
    }, c.name), dead && /*#__PURE__*/React.createElement(IconSkull, {
      className: "w-3.5 h-3.5 text-neutral-500 shrink-0"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500"
    }, "Init"), isLinkedChild ? /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-neutral-300 tabular-nums px-1",
      title: `Shares initiative with ${linkedParentName}`
    }, c.initiative === null || c.initiative === undefined ? "—" : c.initiative) : /*#__PURE__*/React.createElement(InitiativeEditor, {
      value: c.initiative,
      onChange: onInitChange
    }), /*#__PURE__*/React.createElement(StatusPill, {
      status: c.status
    })))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 shrink-0"
    }, !isMarker && !dead && onChain && /*#__PURE__*/React.createElement("button", {
      onClick: onChain,
      title: chainState === "linked" ? "Unlink" : chainState === "selected" ? "Cancel linking" : chainState === "target" ? "Link with the selected creature" : "Link to another creature (shared initiative)",
      className: `transition-colors ${chainState === "selected" ? "text-orange-500" : chainState === "linked" ? "text-emerald-400 hover:text-emerald-300" : chainState === "target" ? "text-orange-300/70 hover:text-orange-400" : "text-neutral-600 hover:text-orange-300"}`
    }, /*#__PURE__*/React.createElement(IconChain, {
      className: "w-4 h-4"
    })), (isEnemy || isNpc) && !dead && /*#__PURE__*/React.createElement("button", {
      onClick: markDead,
      title: "Mark dead",
      className: "text-neutral-600 hover:text-rose-400"
    }, /*#__PURE__*/React.createElement(IconSkull, {
      className: "w-4 h-4"
    })), isEnemy && !inCombat && /*#__PURE__*/React.createElement("button", {
      onClick: onSetClipboard,
      title: "Set as Duplicate source",
      className: "text-neutral-600 hover:text-sky-300"
    }, /*#__PURE__*/React.createElement(IconClipboard, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: onRemove,
      disabled: inCombat,
      title: inCombat ? "Can't remove mid-initiative" : "Remove",
      className: `text-neutral-600 ${inCombat ? "opacity-30 cursor-not-allowed" : "hover:text-neutral-300"}`
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-4 h-4"
    })))), isPlayer && /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex rounded-lg border border-neutral-700 overflow-hidden text-xs font-semibold"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: setAlive,
      className: `flex-1 py-1.5 transition-colors ${!isDownGroup ? "bg-emerald-600 text-white" : "bg-neutral-900 text-neutral-500 hover:text-neutral-300"}`
    }, "Alive"), /*#__PURE__*/React.createElement("button", {
      onClick: setDown,
      className: `flex-1 py-1.5 transition-colors ${isDownGroup ? "bg-amber-600 text-neutral-950" : "bg-neutral-900 text-neutral-500 hover:text-neutral-300"}`
    }, "Unconscious")), c.status === "unconscious" && /*#__PURE__*/React.createElement(DeathSaves, {
      combatant: c,
      onUpdate: onUpdate
    })), (isEnemy || isNpc) && /*#__PURE__*/React.createElement("div", {
      className: "mt-2.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-xs mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-neutral-500"
    }, "HP"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-neutral-300"
    }, c.currentHp, " / ", c.maxHp)), /*#__PURE__*/React.createElement("div", {
      className: "h-2 rounded-full bg-neutral-800 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full transition-all ${pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-rose-500"}`,
      style: {
        width: `${pct}%`
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 mt-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => applyHp(-1),
      className: "w-6 h-6 rounded bg-neutral-800 hover:bg-rose-900/50 text-neutral-300 text-sm font-bold"
    }, "−"), /*#__PURE__*/React.createElement("button", {
      onClick: () => applyHp(1),
      className: "w-6 h-6 rounded bg-neutral-800 hover:bg-emerald-900/50 text-neutral-300 text-sm font-bold"
    }, "+")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1.5 mt-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("input", {
      value: dmgInput,
      onChange: e => setDmgInput(e.target.value),
      onKeyDown: e => e.key === "Enter" && applyDamage(),
      placeholder: "Damage",
      inputMode: "numeric",
      className: "w-full min-w-0 text-xs bg-neutral-900 border border-rose-900/60 rounded px-2 py-1 outline-none focus:border-rose-500 text-neutral-200 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: applyDamage,
      className: "text-xs px-2 py-1 rounded bg-rose-800 hover:bg-rose-700 text-rose-100 font-bold shrink-0"
    }, "−")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("input", {
      value: healInput,
      onChange: e => setHealInput(e.target.value),
      onKeyDown: e => e.key === "Enter" && applyHeal(),
      placeholder: "Heal",
      inputMode: "numeric",
      className: "w-full min-w-0 text-xs bg-neutral-900 border border-emerald-900/60 rounded px-2 py-1 outline-none focus:border-emerald-500 text-neutral-200 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: applyHeal,
      className: "text-xs px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold shrink-0"
    }, "+"))), isNpc && c.status === "unconscious" && /*#__PURE__*/React.createElement(DeathSaves, {
      combatant: c,
      onUpdate: onUpdate
    })), !isMarker && /*#__PURE__*/React.createElement(ConditionRow, {
      c: c,
      onAdd: (name, limit) => onUpdate({
        conditions: [...c.conditions, makeCondition(name, limit)]
      }),
      onRemove: condId => onUpdate({
        conditions: c.conditions.filter(t => t.id !== condId)
      }),
      onClearCarriedOver: condId => onUpdate({
        conditions: c.conditions.map(t => t.id === condId ? {
          ...t,
          carriedOver: false
        } : t)
      }),
      onStartConcentration: limit => onUpdate({
        concentration: makeConcentration(limit)
      }),
      onDropConcentration: () => onUpdate({
        concentration: INACTIVE_CONCENTRATION
      }),
      onClearConcentrationCarriedOver: () => onUpdate({
        concentration: {
          ...c.concentration,
          carriedOver: false
        }
      })
    }), inCombat && isCurrent && !hideEndTurn && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        onEndTurn();
        setStatBlockOpen(false);
      },
      className: "mt-3 w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-lg py-1.5 transition-colors"
    }, "End Turn ", /*#__PURE__*/React.createElement(IconChevronRight, {
      className: "w-4 h-4"
    })), (isEnemy || isNpc) && hasAdvancedInfo(c.advanced) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: () => setStatBlockOpen(v => !v),
      className: "mt-1.5 w-full flex items-center justify-center gap-1 text-xs text-neutral-500 hover:text-neutral-300"
    }, statBlockOpen ? /*#__PURE__*/React.createElement(IconChevronUp, {
      className: "w-3 h-3"
    }) : /*#__PURE__*/React.createElement(IconChevronDown, {
      className: "w-3 h-3"
    }), statBlockOpen ? "Collapse stat block" : "Expand stat block"), statBlockOpen && /*#__PURE__*/React.createElement(StatBlockPanel, {
      advanced: c.advanced,
      cr: c.cr
    })));
  }
  function EditorSection({
    title,
    icon,
    accent,
    open,
    onToggle,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: `rounded-lg border ${accent.border} ${accent.bg}`
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onToggle,
      className: `w-full flex items-center justify-between px-3 py-2 text-sm font-semibold ${accent.text}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1.5"
    }, icon, " ", title), /*#__PURE__*/React.createElement(IconChevronDown, {
      className: `w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`
    })), open && /*#__PURE__*/React.createElement("div", {
      className: "px-3 pb-3 space-y-1.5"
    }, children));
  }
  function PillSwitch({
    checked,
    onClick,
    title
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      title: title,
      className: `w-9 h-5 rounded-full transition-colors relative shrink-0 ${checked ? "bg-emerald-500" : "bg-neutral-700"}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`
    }));
  }
  function RoundDivider() {
    return /*#__PURE__*/React.createElement("div", {
      className: "h-px my-1 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"
    });
  }
  function ConfirmModal({
    message,
    onCancel,
    onConfirm
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg overflow-hidden shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_ICON,
      alt: "",
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-neutral-200"
    }, "TableQuest")), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-300 mb-4"
    }, message), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onCancel,
      className: "flex-1 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg py-2"
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      onClick: onConfirm,
      className: "flex-1 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg py-2"
    }, "Confirm"))));
  }
  function EndInitiativeModal({
    onEnd,
    onReroll,
    onCancel
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg overflow-hidden shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_ICON,
      alt: "",
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-neutral-200"
    }, "TableQuest")), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-300 mb-4"
    }, "End this fight's initiative, or reroll enemies for a new one?"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onEnd,
      className: "w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg py-2"
    }, /*#__PURE__*/React.createElement(IconStop, {
      className: "w-4 h-4"
    }), " End Initiative"), /*#__PURE__*/React.createElement("button", {
      onClick: onReroll,
      className: "w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-neutral-950 rounded-lg py-2"
    }, /*#__PURE__*/React.createElement(IconD20, {
      className: "w-4 h-4"
    }), " Re-Roll Initiative"), /*#__PURE__*/React.createElement("button", {
      onClick: onCancel,
      className: "w-full text-sm font-medium bg-transparent hover:bg-neutral-800 text-neutral-400 rounded-lg py-2"
    }, "Cancel")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 mt-3"
    }, "Re-Roll keeps player initiatives and rerolls enemies for a fresh round 1. Ended by mistake? Tap Resume afterwards to bring back the same rolls.")));
  }
  function ClearResetModal({
    onClearEnemies,
    onResetAll,
    onCancel
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg overflow-hidden shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_ICON,
      alt: "",
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-neutral-200"
    }, "TableQuest")), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-300 mb-4"
    }, "What would you like to clear?"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onClearEnemies,
      className: "w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg py-2"
    }, /*#__PURE__*/React.createElement(IconTrash, {
      className: "w-4 h-4"
    }), " Clear Enemies & Markers"), /*#__PURE__*/React.createElement("button", {
      onClick: onResetAll,
      className: "w-full flex items-center justify-center gap-1.5 text-sm font-semibold bg-rose-700 hover:bg-rose-600 text-white rounded-lg py-2"
    }, /*#__PURE__*/React.createElement(IconRotateCcw, {
      className: "w-4 h-4"
    }), " Reset Everything"), /*#__PURE__*/React.createElement("button", {
      onClick: onCancel,
      className: "w-full text-sm font-medium bg-transparent hover:bg-neutral-800 text-neutral-400 rounded-lg py-2"
    }, "Cancel"))));
  }
  const ICON_CREDITS = [{
    title: "Info Circle SVG Vector",
    author: "Solar Icons",
    url: "https://www.svgrepo.com/svg/524660/info-circle"
  }, {
    title: "Gear SVG Vector",
    author: "thewolfkit",
    url: "https://www.svgrepo.com/svg/491639/gear"
  }, {
    title: "Shield Alt SVG Vector",
    author: "Dazzle UI",
    url: "https://www.svgrepo.com/svg/532326/shield-alt"
  }, {
    title: "Dice Twenty Faces One SVG Vector",
    author: "game-icons.net",
    url: "https://www.svgrepo.com/svg/322179/dice-twenty-faces-one"
  }];
  const HELP_QUICK_START = ["Open the Editor and add your Players, NPCs and Enemies. A quantity makes numbered copies (Goblin 1, Goblin 2…).", "Tap Roll Initiative. Enemies and NPCs are rolled for you; set player initiatives first by typing them in on each card.", "Tap End Turn on the highlighted card to move on. The round counter advances after everyone has gone.", "Track damage, healing, conditions and concentration on the cards. Tap End Initiative when the fight is over."];
  const HELP_FAQ = [["How do I set player initiative?", "Type it into the Init box on the player's card (or use − / +) before you roll. Players start at 10. If you'd rather have the app roll for players too, switch on “Roll initiative for players” in Settings (the gear icon)."], ["I ended initiative by mistake. Can I get it back?", "Yes. Right after End Initiative, the rewind button next to Roll Initiative brings the fight back with the same rolls, turn order, round and condition timers. It stays available until you roll a new initiative or Reset All."], ["What does the undo arrow do?", "During a fight, it takes back your last End Turn (up to 20 turns back), including the round counter and condition timers."], ["End Initiative vs. Re-Roll?", "While in a fight, End Initiative opens a choice. End Initiative returns everyone to setup. Re-Roll Initiative keeps player initiatives, rerolls enemies and NPCs, and starts a fresh round 1."], ["How do conditions and concentration work?", "Tap + Condition and pick or type one. Add a number of rounds and it counts down at the end of that creature's turn; leave it blank and it counts up. When a timer runs out it's highlighted, and tapping it clears it. Conditions still active when initiative ends are marked “carried over” into the next fight; tap to clear them."], ["How do I handle a creature going down or dying?", "Use the Alive / Unconscious switch on a card; Unconscious shows death saves. The skull marks a creature dead and moves it to the bottom of the list."], ["How do I link a mount and rider?", "Tap the chain icon on one card (it turns orange), then the chain icon on the other. They now share one initiative and one turn, and the second card sits indented under the first. Tap a linked chain to unlink. A link breaks when either one dies. Linked pairs are saved with encounters."], ["Where are the stat blocks?", "In the Add Enemy and Add NPC forms, open Advanced to fill in AC, speeds, abilities, traits, actions and more. Anything left blank is hidden. On the card, tap Expand stat block. XP is filled in automatically from the CR. When a list (like Actions) has more than one entry, use the up/down arrows beside a row to reorder it, for example to put Multiattack first. The stat block follows that order."], ["How do I roll dice?", "Tap the d20 button at the bottom right, pick a die, and use the slider (1–10) or type a number to choose how many. Tap the same die again to roll. The result appears in the middle of the screen, with Roll again and Close buttons."], ["How do I reuse enemies, encounters and parties?", "In Add Enemy and Add NPC, the Saved lists keep your creatures. Saved Encounters stores the current enemies, NPCs and markers (with links, but not players). Saved Parties stores your players. Pick one and tap Load."], ["How do I make several copies of a creature?", "Tap the clipboard icon on its card to set it as the source, then tap the clipboard button in the Add Enemy form. The form fills with its stats, ready to add."], ["What is a marker?", "A named spot in the turn order with no HP, such as “Lair Actions” at initiative 20. Add one under Add Marker."], ["What does the scale icon do?", "Enter your party's level (and size, if it isn't just your players) to get an approximate encounter difficulty from the enemies' CRs. It's an estimate, not a rule."], ["How do I clear the board?", "Use the trash icon: Clear Enemies keeps your players, while Reset All removes everyone."], ["Is my data safe? Does it work offline?", "Everything is stored only on this device and the app works offline once loaded. Clearing your browser or app data will erase it, so use Editor → Backup & Restore → Export Data now and then. Import Data replaces what's on the device with the file."]];
  const DICE_SIDES = [20, 12, 10, 8, 6, 4];
  const MAX_DICE = 100;

  // Floating dice roller (bottom right): tap the d20 to open, tap a die to pick it
  // (a count slider appears), tap the same die again to roll it.
  function DiceRoller() {
    const [open, setOpen] = useState(false);
    const [sel, setSel] = useState(null);
    const [countText, setCountText] = useState("1");
    const [result, setResult] = useState(null);
    const parsedCount = () => {
      const n = parseInt(countText, 10);
      return isNaN(n) ? 1 : clamp(n, 1, MAX_DICE);
    };
    const setCount = n => setCountText(String(clamp(n, 1, MAX_DICE)));
    const closePanel = () => {
      setOpen(false);
      setSel(null);
      setCountText("1");
    };
    const rollDice = (sides, n) => {
      const rolls = Array.from({
        length: n
      }, () => Math.floor(Math.random() * sides) + 1);
      setResult({
        sides,
        n,
        rolls,
        total: rolls.reduce((a, b) => a + b, 0)
      });
    };
    const tapDie = sides => {
      if (sel !== sides) {
        setSel(sides);
        return;
      }
      rollDice(sides, parsedCount());
      closePanel();
    };
    const n = parsedCount();
    const natural = result && result.n === 1 && result.sides === 20 ? result.total === 20 ? "Natural 20!" : result.total === 1 ? "Natural 1" : "" : "";
    return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-10",
      onClick: closePanel
    }), /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-4 right-4 z-20 flex flex-col items-end gap-2"
    }, open && sel && /*#__PURE__*/React.createElement("div", {
      className: "w-64 rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-2xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-400"
    }, "Number of dice"), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-amber-300"
    }, n, "d", sel)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      step: "1",
      value: Math.min(n, 10),
      "aria-label": "Number of dice",
      onChange: e => setCount(parseInt(e.target.value, 10)),
      className: "flex-1 w-0 min-w-0 accent-amber-500"
    }), /*#__PURE__*/React.createElement("input", {
      value: countText,
      "aria-label": "Custom number of dice",
      inputMode: "numeric",
      onChange: e => setCountText(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)),
      onBlur: () => setCountText(String(parsedCount())),
      className: "w-14 shrink-0 text-center text-sm bg-neutral-950 border border-neutral-700 rounded px-1 py-1 outline-none focus:border-amber-500"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600 mt-1.5"
    }, "Slide for 1–10, or type up to ", MAX_DICE, ". Tap d", sel, " again to roll.")), open && /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 p-1.5 shadow-2xl"
    }, DICE_SIDES.map(d => /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => tapDie(d),
      "aria-label": sel === d ? `Roll ${n}d${d}` : `Select d${d}`,
      className: `w-10 h-10 rounded-lg text-sm font-bold transition-colors ${sel === d ? "bg-amber-500 text-neutral-950" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`
    }, "d", d))), /*#__PURE__*/React.createElement("button", {
      onClick: () => open ? closePanel() : setOpen(true),
      "aria-label": "Dice roller",
      title: "Dice roller",
      className: `w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-colors ${open ? "bg-neutral-800 border-amber-500 text-amber-300" : "bg-gradient-to-br from-amber-500 to-rose-600 border-transparent text-neutral-950"}`
    }, /*#__PURE__*/React.createElement(IconD20, {
      className: "w-6 h-6"
    }))), result && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4",
      onClick: () => setResult(null)
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-xs rounded-xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl text-center",
      onClick: e => e.stopPropagation(),
      role: "dialog",
      "aria-label": "Dice result"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500 mb-1"
    }, result.n, "d", result.sides), /*#__PURE__*/React.createElement("p", {
      className: "text-6xl font-bold text-amber-300 leading-none",
      "data-testid": "dice-total"
    }, result.total), natural && /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold text-amber-200 mt-2"
    }, natural), result.n > 1 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-400 mt-3 max-h-24 overflow-y-auto break-words"
    }, result.rolls.join(" + ")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => rollDice(result.sides, result.n),
      className: "flex-1 text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg py-2"
    }, "Roll again"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setResult(null),
      className: "flex-1 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg py-2"
    }, "Close")))));
  }
  function InfoModal({
    onClose
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl max-h-[85vh] overflow-y-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-7 h-7 rounded-lg overflow-hidden shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_ICON,
      alt: "",
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold text-neutral-200"
    }, "TableQuest"), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      className: "ml-auto text-neutral-500 hover:text-neutral-300"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-4 h-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-neutral-400 mb-1.5"
    }, "Help & FAQ"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-amber-300 mb-1"
    }, "Quick start"), /*#__PURE__*/React.createElement("ol", {
      className: "list-decimal pl-4 space-y-1 text-xs text-neutral-400 mb-3"
    }, HELP_QUICK_START.map(t => /*#__PURE__*/React.createElement("li", {
      key: t
    }, t))), /*#__PURE__*/React.createElement("div", {
      className: "divide-y divide-neutral-800 border-y border-neutral-800"
    }, HELP_FAQ.map(([q, a]) => /*#__PURE__*/React.createElement("details", {
      key: q,
      className: "group py-1.5"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "flex items-center justify-between gap-2 cursor-pointer list-none text-xs font-medium text-neutral-300 hover:text-neutral-100 [&::-webkit-details-marker]:hidden"
    }, /*#__PURE__*/React.createElement("span", null, q), /*#__PURE__*/React.createElement(IconChevronDown, {
      className: "w-3.5 h-3.5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-400 mt-1.5 pr-5"
    }, a))))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-neutral-400"
    }, "Icon Credits"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, ICON_CREDITS.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.url,
      className: "text-xs text-neutral-400"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-neutral-200"
    }, "\"", c.title, "\" — ", c.author, " (", /*#__PURE__*/React.createElement("a", {
      href: "https://creativecommons.org/licenses/by/4.0/",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-sky-400 hover:text-sky-300 underline"
    }, "CC Attribution"), ")"), /*#__PURE__*/React.createElement("a", {
      href: c.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-sky-500 hover:text-sky-400 underline break-all"
    }, c.url)))))));
  }

  // Lists characters saved in Player mode so they can join the fight with their initiative bonus.
  function SheetPcPicker({
    chars,
    present,
    onAdd
  }) {
    const fresh = chars.filter(c => !present.includes(c.name.toLowerCase()));
    if (chars.length === 0) return /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600",
      "data-testid": "sheet-empty"
    }, "No sheet characters yet. Open Player mode to create one.");
    return /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg border border-amber-900/40 bg-amber-950/10 p-2 space-y-1.5"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-amber-300"
    }, "From your character sheet"), fresh.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "All sheet characters are already in the list."), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5"
    }, fresh.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => onAdd([c]),
      "aria-label": `Add ${c.name} from sheet`,
      className: "text-xs rounded-full border border-amber-700/60 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 text-neutral-200"
    }, "+ ", c.name, " ", /*#__PURE__*/React.createElement("span", {
      className: "text-neutral-500"
    }, c.initMod >= 0 ? "+" : "−", Math.abs(c.initMod))))), fresh.length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: () => onAdd(fresh),
      className: "text-xs text-amber-300 hover:text-amber-200"
    }, "Add all (", fresh.length, ")"));
  }
  function CombatTracker({
    onSwitch,
    getSheetChars
  }) {
    const savedState = loadJSON(STATE_KEY, null);
    const [combatants, setCombatants] = useState((savedState?.combatants || []).map(normalizeCombatant));
    const [round, setRound] = useState(savedState?.round || 1);
    const [turnsThisRound, setTurnsThisRound] = useState(savedState?.turnsThisRound || 0);
    const [inCombat, setInCombat] = useState(savedState?.inCombat || false);
    const [savedEncounters, setSavedEncounters] = useState(loadJSON(ENCOUNTERS_KEY, {}));
    const [savedParties, setSavedParties] = useState(loadJSON(PARTIES_KEY, {}));
    const [showEditor, setShowEditor] = useState(false);
    const [showPlayerForm, setShowPlayerForm] = useState(false);
    const [showNpcForm, setShowNpcForm] = useState(false);
    const [showEnemyForm, setShowEnemyForm] = useState(false);
    const [showEncounterForm, setShowEncounterForm] = useState(false);
    const [showPartyForm, setShowPartyForm] = useState(false);
    const [showBackupForm, setShowBackupForm] = useState(false);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [showDifficultyPopover, setShowDifficultyPopover] = useState(false);
    const [showSettingsPopover, setShowSettingsPopover] = useState(false);
    const [showClearResetModal, setShowClearResetModal] = useState(false);
    const [playerForm, setPlayerForm] = useState({
      name: "",
      initMod: ""
    });
    const [enemyForm, setEnemyForm] = useState({
      name: "",
      qty: "",
      maxHp: "",
      mod: "",
      cr: "",
      color: null,
      advanced: makeDefaultAdvanced()
    });
    const [enemyClipboard, setEnemyClipboard] = useState(null);
    const [npcForm, setNpcForm] = useState({
      name: "",
      qty: "",
      maxHp: "",
      mod: "",
      advanced: makeDefaultAdvanced()
    });
    const [savedEnemyTemplates, setSavedEnemyTemplates] = useState(loadJSON(ENEMY_TEMPLATES_KEY, {}));
    const [showEnemyLibrary, setShowEnemyLibrary] = useState(false);
    const [selectedEnemyTemplate, setSelectedEnemyTemplate] = useState("");
    const [savedNpcTemplates, setSavedNpcTemplates] = useState(loadJSON(NPC_TEMPLATES_KEY, {}));
    const [showNpcLibrary, setShowNpcLibrary] = useState(false);
    const [selectedNpcTemplate, setSelectedNpcTemplate] = useState("");
    const [markerForm, setMarkerForm] = useState({
      name: "",
      initiative: "20"
    });
    const [encounterName, setEncounterName] = useState("");
    const [selectedEncounter, setSelectedEncounter] = useState("");
    const [partyName, setPartyName] = useState("");
    const [selectedParty, setSelectedParty] = useState("");
    const [partyLevel, setPartyLevel] = useState(savedState?.partyLevel || "");
    const [partySize, setPartySize] = useState(savedState?.partySize || "");
    const [rollPlayersInitiative, setRollPlayersInitiative] = useState(savedState?.rollPlayersInitiative || false);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const requestConfirm = (message, onConfirm) => setConfirmDialog({
      message,
      onConfirm
    });
    const [showEndInitiativeModal, setShowEndInitiativeModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showModeMenu, setShowModeMenu] = useState(false);
    const [linkSourceId, setLinkSourceId] = useState(null);
    const currentCardRef = useRef(null);
    const importInputRef = useRef(null);
    const [importError, setImportError] = useState("");
    const [currentCardVisible, setCurrentCardVisible] = useState(true);
    const [roundFlash, setRoundFlash] = useState(false);
    const prevRoundRef = useRef(round);
    useEffect(() => {
      if (prevRoundRef.current !== round) {
        setRoundFlash(true);
        prevRoundRef.current = round;
        const t = setTimeout(() => setRoundFlash(false), 700);
        return () => clearTimeout(t);
      }
    }, [round]);
    const [turnHistory, setTurnHistory] = useState([]);

    // Snapshot taken when initiative is ended, so it can be resumed with the same
    // rolls, order and round if End Initiative was pressed by mistake.
    const [lastInitiative, setLastInitiative] = useState(() => {
      const s = savedState?.lastInitiative;
      if (!s || !Array.isArray(s.combatants)) return null;
      return {
        combatants: s.combatants.map(normalizeCombatant),
        round: s.round || 1,
        turnsThisRound: s.turnsThisRound || 0
      };
    });
    useEffect(() => {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        combatants,
        round,
        turnsThisRound,
        inCombat,
        partyLevel,
        partySize,
        rollPlayersInitiative,
        lastInitiative
      }));
    }, [combatants, round, turnsThisRound, inCombat, partyLevel, partySize, rollPlayersInitiative, lastInitiative]);
    useEffect(() => {
      localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(savedEncounters));
    }, [savedEncounters]);
    useEffect(() => {
      localStorage.setItem(PARTIES_KEY, JSON.stringify(savedParties));
    }, [savedParties]);
    useEffect(() => {
      localStorage.setItem(ENEMY_TEMPLATES_KEY, JSON.stringify(savedEnemyTemplates));
    }, [savedEnemyTemplates]);
    useEffect(() => {
      localStorage.setItem(NPC_TEMPLATES_KEY, JSON.stringify(savedNpcTemplates));
    }, [savedNpcTemplates]);
    useEffect(() => {
      if (!inCombat || !currentCardRef.current || typeof IntersectionObserver === "undefined") {
        setCurrentCardVisible(true);
        return;
      }
      const el = currentCardRef.current;
      const obs = new IntersectionObserver(([entry]) => setCurrentCardVisible(entry.isIntersecting), {
        threshold: 0.01
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, [inCombat, combatants]);
    const makeMarker = (name, initiative) => ({
      id: uid(),
      type: "marker",
      name,
      initiative,
      conditions: [],
      concentration: INACTIVE_CONCENTRATION
    });
    const makePlayer = (name, initMod) => ({
      id: uid(),
      type: "player",
      name,
      initiative: 10,
      initMod: initMod || 0,
      status: "active",
      conditions: [],
      concentration: INACTIVE_CONCENTRATION,
      deathSaves: {
        success: 0,
        fail: 0
      }
    });
    const addPlayer = () => {
      if (!playerForm.name.trim()) return;
      const mod = parseInt(playerForm.initMod, 10) || 0;
      const c = makePlayer(playerForm.name.trim(), mod);
      setCombatants(prev => inCombat ? insertSorted(prev, c) : setupSort([...prev, c]));
      setPlayerForm({
        name: "",
        initMod: ""
      });
    };
    const buildEnemies = (name, qty, hp, mod, color, cr, existingNames, advanced) => {
      const names = existingNames || new Set();
      const list = [];
      const hasCollision = names.has(name) || nextStartNumber(names, name) > 0;
      if (qty === 1 && !hasCollision) {
        const label = name;
        names.add(label);
        list.push({
          id: uid(),
          type: "enemy",
          name: label,
          initiative: inCombat ? roll20() + mod : null,
          autoRolled: inCombat,
          initMod: mod,
          maxHp: hp,
          currentHp: hp,
          status: "active",
          conditions: [],
          concentration: INACTIVE_CONCENTRATION,
          deathSaves: {
            success: 0,
            fail: 0
          },
          color,
          cr: cr || null,
          advanced: advanced || null
        });
      } else {
        const start = nextStartNumber(names, name) + 1;
        for (let i = 0; i < qty; i++) {
          const label = `${name} ${start + i}`;
          names.add(label);
          list.push({
            id: uid(),
            type: "enemy",
            name: label,
            initiative: inCombat ? roll20() + mod : null,
            autoRolled: inCombat,
            initMod: mod,
            maxHp: hp,
            currentHp: hp,
            status: "active",
            conditions: [],
            concentration: INACTIVE_CONCENTRATION,
            deathSaves: {
              success: 0,
              fail: 0
            },
            color,
            cr: cr || null,
            advanced: advanced || null
          });
        }
      }
      return list;
    };
    const buildNpcs = (name, qty, hp, mod, advanced) => {
      const list = [];
      for (let i = 0; i < qty; i++) {
        const label = qty > 1 ? `${name} ${i + 1}` : name;
        list.push({
          id: uid(),
          type: "npc",
          name: label,
          initiative: inCombat ? roll20() + mod : null,
          autoRolled: inCombat,
          initMod: mod,
          maxHp: hp,
          currentHp: hp,
          status: "active",
          conditions: [],
          concentration: INACTIVE_CONCENTRATION,
          deathSaves: {
            success: 0,
            fail: 0
          },
          color: NPC_COLOR,
          advanced: advanced || null
        });
      }
      return list;
    };
    const addToList = newItems => {
      setCombatants(prev => {
        let next = [...prev];
        newItems.forEach(c => {
          if (!inCombat) {
            next = [...next, c];
            return;
          }
          // A linked child goes straight behind its parent (and any siblings).
          const pIdx = c.linkedTo ? next.findIndex(x => x.id === c.linkedTo) : -1;
          if (pIdx >= 0) {
            let at = pIdx + 1;
            while (at < next.length && next[at].linkedTo === c.linkedTo) at++;
            next.splice(at, 0, c);
          } else {
            next = insertSorted(next, c);
          }
        });
        return inCombat ? next : setupSort(next);
      });
    };
    const addEnemies = () => {
      const hp = parseInt(enemyForm.maxHp, 10);
      const mod = parseInt(enemyForm.mod, 10) || 0;
      const qty = clamp(parseInt(enemyForm.qty, 10) || 1, 1, 20);
      if (!enemyForm.name.trim() || isNaN(hp)) return;
      const existingNames = new Set(combatants.filter(c => c.type === "enemy").map(c => c.name));
      const newEnemies = buildEnemies(enemyForm.name.trim(), qty, hp, mod, enemyForm.color, enemyForm.cr.trim(), existingNames, enemyForm.advanced);
      addToList(newEnemies);
      setEnemyForm({
        name: "",
        qty: "",
        maxHp: "",
        mod: "",
        cr: "",
        color: null,
        advanced: makeDefaultAdvanced()
      });
    };

    // Duplicate now works off an explicitly-chosen clipboard (set via the
    // per-card clipboard button) rather than auto-tracking the last add.
    const setClipboardFromCard = c => {
      setEnemyClipboard({
        sourceId: c.id,
        name: c.name,
        maxHp: c.maxHp,
        initMod: c.initMod,
        cr: c.cr,
        advanced: c.advanced
      });
    };
    const duplicateEnemy = () => {
      if (!enemyClipboard) return;
      setEnemyForm({
        name: deriveDuplicateBaseName(enemyClipboard.name),
        qty: "",
        maxHp: String(enemyClipboard.maxHp),
        mod: String(enemyClipboard.initMod || 0),
        cr: enemyClipboard.cr || "",
        color: null,
        advanced: enemyClipboard.advanced || makeDefaultAdvanced()
      });
    };
    const addNpcs = () => {
      const hp = parseInt(npcForm.maxHp, 10);
      const mod = parseInt(npcForm.mod, 10) || 0;
      const qty = clamp(parseInt(npcForm.qty, 10) || 1, 1, 20);
      if (!npcForm.name.trim() || isNaN(hp)) return;
      addToList(buildNpcs(npcForm.name.trim(), qty, hp, mod, npcForm.advanced));
      setNpcForm({
        name: "",
        qty: "",
        maxHp: "",
        mod: "",
        advanced: makeDefaultAdvanced()
      });
    };
    const addMarker = () => {
      if (!markerForm.name.trim()) return;
      const init = parseInt(markerForm.initiative, 10);
      const c = makeMarker(markerForm.name.trim(), isNaN(init) ? 20 : init);
      setCombatants(prev => inCombat ? insertSorted(prev, c) : setupSort([...prev, c]));
      setMarkerForm({
        name: "",
        initiative: "20"
      });
    };
    const pickColor = col => {
      setEnemyForm(f => {
        const remainder = stripLeadingColor(f.name.trim());
        const newName = remainder ? `${col.name} ${remainder}` : col.name;
        return {
          ...f,
          name: newName,
          color: col.hex
        };
      });
    };
    const updateCombatant = (id, patch) => {
      setCombatants(prev => {
        const idx = prev.findIndex(c => c.id === id);
        if (idx === -1) return prev;
        const {
          _revive,
          ...cleanPatch
        } = patch;
        const updated = {
          ...prev[idx],
          ...cleanPatch
        };
        if (_revive) {
          const rest = prev.filter(c => c.id !== id);
          return insertSorted(rest, updated);
        }
        let next = [...prev];
        next[idx] = updated;
        // Death breaks a link: the dead creature drops to the bottom as usual and
        // any survivor carries on as an ordinary combatant.
        if (cleanPatch.status === "dead" && prev[idx].status !== "dead") next = breakLinksOnDeath(next, id);
        return next;
      });
    };
    const setInitiative = (id, value) => {
      setCombatants(prev => {
        const updated = syncLinkedInitiative(prev.map(c => c.id === id ? {
          ...c,
          initiative: value
        } : c));
        return inCombat ? sortByInitiative(updated) : updated;
      });
    };
    const removeCombatant = id => setCombatants(prev => clearOrphanLinks(prev.filter(c => c.id !== id)));
    const clearEnemies = () => {
      setCombatants(prev => clearOrphanLinks(prev.filter(c => c.type !== "enemy" && c.type !== "marker")));
      // enemyClipboard intentionally survives Clear Enemies — it only resets on Reset All.
    };

    // ---- Linking (rider + mount share one turn) ----
    const linkedIds = new Set();
    {
      const byId = new Map(combatants.map(c => [c.id, c]));
      combatants.forEach(c => {
        if (isAttachedChild(c, byId)) {
          linkedIds.add(c.id);
          linkedIds.add(c.linkedTo);
        }
      });
    }
    const activeLinkSource = combatants.find(c => c.id === linkSourceId && c.status !== "dead" && !linkedIds.has(c.id)) || null;
    const linkCreatures = (parentId, childId) => {
      setCombatants(prev => {
        const parent = prev.find(c => c.id === parentId);
        const child = prev.find(c => c.id === childId);
        if (!parent || !child || parent.linkedTo || child.linkedTo) return prev;
        // Put the child right behind its parent and let it share the parent's initiative.
        const without = prev.filter(c => c.id !== childId);
        const at = without.findIndex(c => c.id === parentId);
        without.splice(at + 1, 0, {
          ...child,
          linkedTo: parentId,
          initiative: parent.initiative,
          autoRolled: parent.autoRolled
        });
        return without;
      });
    };
    const unlinkCreature = id => {
      setCombatants(prev => prev.map(c => c.id === id && c.linkedTo || c.linkedTo === id ? releaseChild(c) : c));
    };

    // First tap selects (turns orange), tapping the same chain again cancels,
    // tapping another creature's chain links the two. Tapping a linked chain unlinks.
    const handleChain = id => {
      const target = combatants.find(c => c.id === id);
      if (!target || target.status === "dead") return;
      if (linkedIds.has(id)) {
        unlinkCreature(id);
        setLinkSourceId(null);
        return;
      }
      if (!activeLinkSource) {
        setLinkSourceId(id);
        return;
      }
      if (activeLinkSource.id === id) {
        setLinkSourceId(null);
        return;
      }
      linkCreatures(activeLinkSource.id, id);
      setLinkSourceId(null);
    };

    // Flags any still-active, non-expired conditions as "carried over" whenever
    // a fresh Round 1 starts — the one signal we track for "did unaccounted
    // time pass?" instead of a real clock.
    const flagCarriedOverConditions = c => {
      let next = c;
      if (next.conditions && next.conditions.length > 0) {
        next = {
          ...next,
          conditions: next.conditions.map(cond => cond.expired ? cond : {
            ...cond,
            carriedOver: true
          })
        };
      }
      if (next.concentration && next.concentration.active && !next.concentration.expired) {
        next = {
          ...next,
          concentration: {
            ...next.concentration,
            carriedOver: true
          }
        };
      }
      return next;
    };
    const rollInitiative = () => {
      setCombatants(prev => {
        const rolled = prev.map(c => {
          if ((c.type === "enemy" || c.type === "npc") && (c.initiative === null || c.initiative === undefined)) {
            return {
              ...c,
              initiative: roll20() + (c.initMod || 0),
              autoRolled: true
            };
          }
          if (c.type === "player" && rollPlayersInitiative) {
            return {
              ...c,
              initiative: roll20() + (c.initMod || 0),
              autoRolled: true
            };
          }
          return c;
        });
        return sortByInitiative(syncLinkedInitiative(rolled));
      });
      setInCombat(true);
      setRound(1);
      setTurnsThisRound(0);
      setTurnHistory([]);
      setLastInitiative(null);
    };
    const endInitiative = () => {
      setLastInitiative({
        combatants,
        round,
        turnsThisRound
      });
      setCombatants(prev => {
        const reverted = prev.map(c => {
          let next = flagCarriedOverConditions(c);
          if ((next.type === "enemy" || next.type === "npc") && next.autoRolled) next = {
            ...next,
            initiative: null,
            autoRolled: false
          };
          if (next.type === "player") next = {
            ...next,
            initiative: 10,
            autoRolled: false
          };
          return next;
        });
        return setupSort(syncLinkedInitiative(reverted));
      });
      setInCombat(false);
      setRound(1);
      setTurnsThisRound(0);
      setTurnHistory([]);
    };

    // Anyone from the ended fight who still exists gets their old initiative,
    // conditions and turn position back (HP/status stay as they are now).
    // Anyone added since is rolled in; anyone removed since is simply gone.
    const canResume = !!lastInitiative && combatants.some(c => lastInitiative.combatants.some(s => s.id === c.id));
    const resumeInitiative = () => {
      if (!lastInitiative || !canResume) return;
      const snapIdx = new Map(lastInitiative.combatants.map((s, i) => [s.id, i]));
      const snapById = new Map(lastInitiative.combatants.map(s => [s.id, s]));
      const restored = combatants.map(c => {
        const s = snapById.get(c.id);
        if (s) return {
          ...c,
          initiative: s.initiative,
          autoRolled: s.autoRolled,
          conditions: s.conditions,
          concentration: s.concentration
        };
        if ((c.type === "enemy" || c.type === "npc") && (c.initiative === null || c.initiative === undefined)) return {
          ...c,
          initiative: roll20() + (c.initMod || 0),
          autoRolled: true
        };
        if (c.type === "player" && rollPlayersInitiative) return {
          ...c,
          initiative: roll20() + (c.initMod || 0),
          autoRolled: true
        };
        return c;
      });
      const synced = syncLinkedInitiative(restored);
      const alive = synced.filter(c => c.status !== "dead");
      const dead = synced.filter(c => c.status === "dead");
      const known = alive.filter(c => snapIdx.has(c.id)).sort((a, b) => snapIdx.get(a.id) - snapIdx.get(b.id));
      const fresh = alive.filter(c => !snapIdx.has(c.id));
      // New units slot in by initiative; a new child just follows its parent.
      const knownIds = new Set(known.map(c => c.id));
      let units = buildUnits(known);
      buildUnits(fresh).filter(u => !(u[0].linkedTo && knownIds.has(u[0].linkedTo))).forEach(u => {
        units = insertUnitSorted(units, u);
      });
      const strays = fresh.filter(c => c.linkedTo && knownIds.has(c.linkedTo));
      // Re-group so every child sits directly behind its parent.
      const ordered = [...buildUnits([...units.flat(), ...strays]).flat(), ...dead];
      const unitCount = buildUnits(ordered.filter(c => c.status !== "dead")).length;
      setCombatants(ordered);
      setInCombat(true);
      setRound(lastInitiative.round);
      setTurnsThisRound(Math.min(lastInitiative.turnsThisRound, Math.max(unitCount - 1, 0)));
      setTurnHistory([]);
      setLastInitiative(null);
    };
    const reRollInitiative = () => {
      setCombatants(prev => {
        const rerolled = prev.map(c => {
          let next = flagCarriedOverConditions(c);
          if (next.type === "enemy" || next.type === "npc") {
            next = {
              ...next,
              initiative: roll20() + (next.initMod || 0),
              autoRolled: true
            };
          } else if (next.type === "player" && rollPlayersInitiative) {
            next = {
              ...next,
              initiative: roll20() + (next.initMod || 0),
              autoRolled: true
            };
          }
          return next;
        });
        return sortByInitiative(syncLinkedInitiative(rerolled));
      });
      setRound(1);
      setTurnsThisRound(0);
      setTurnHistory([]);
    };

    // A turn belongs to a whole unit (a creature plus anything linked to it), so
    // rounds count units, and every creature in the acting unit has its
    // condition/concentration counters ticked here — whichever End Turn button
    // (card or sticky banner) triggered it.
    const endTurn = () => {
      const unitCount = buildUnits(combatants.filter(c => c.status !== "dead")).length;
      if (unitCount === 0) return;
      setTurnHistory(h => [...h, {
        combatants,
        round,
        turnsThisRound
      }].slice(-20));
      setCombatants(prev => {
        const aliveNow = prev.filter(c => c.status !== "dead");
        const deadNow = prev.filter(c => c.status === "dead");
        const units = buildUnits(aliveNow);
        if (units.length === 0) return prev;
        const [first, ...rest] = units;
        return [...rest.flat(), ...first.map(tickCreature), ...deadNow];
      });
      setTurnsThisRound(t => {
        const next = t + 1;
        if (next >= unitCount) {
          setRound(r => r + 1);
          return 0;
        }
        return next;
      });
    };
    const undoEndTurn = () => {
      setTurnHistory(h => {
        if (h.length === 0) return h;
        const last = h[h.length - 1];
        setCombatants(last.combatants);
        setRound(last.round);
        setTurnsThisRound(last.turnsThisRound);
        return h.slice(0, -1);
      });
    };
    const resetAll = () => {
      setLinkSourceId(null);
      setCombatants([]);
      setRound(1);
      setTurnsThisRound(0);
      setInCombat(false);
      setEnemyClipboard(null);
      setLastInitiative(null);
    };
    const saveEncounter = () => {
      const name = encounterName.trim();
      if (!name) return;
      const saved = combatants.filter(c => c.type === "enemy" || c.type === "npc" || c.type === "marker");
      const idxById = new Map(saved.map((c, i) => [c.id, i]));
      const byId = new Map(combatants.map(c => [c.id, c]));
      const templates = saved.map(c => {
        const t = c.type === "marker" ? {
          type: "marker",
          name: c.name,
          initiative: c.initiative
        } : {
          type: c.type,
          name: c.name,
          maxHp: c.maxHp,
          initMod: c.initMod || 0,
          color: c.color || null,
          cr: c.cr || null,
          advanced: c.advanced || null
        };
        // Remember a link by the parent's position in this saved list. Links to
        // creatures that aren't saved (players) are simply left out.
        if (isAttachedChild(c, byId) && idxById.has(c.linkedTo)) t.linkedToIdx = idxById.get(c.linkedTo);
        return t;
      });
      if (templates.length === 0) return;
      setSavedEncounters(prev => ({
        ...prev,
        [name]: templates
      }));
      setEncounterName("");
    };
    const loadEncounter = () => {
      if (!selectedEncounter || !savedEncounters[selectedEncounter]) return;
      const templates = savedEncounters[selectedEncounter];
      const existingNames = new Set(combatants.filter(c => c.type === "enemy").map(c => c.name));
      const built = templates.map(t => {
        if (t.type === "marker") return makeMarker(t.name, t.initiative);
        if (t.type === "npc") return buildNpcs(t.name, 1, t.maxHp, t.initMod, t.advanced)[0];
        return buildEnemies(t.name, 1, t.maxHp, t.initMod, t.color, t.cr, existingNames, t.advanced)[0];
      });
      // Re-create saved links with the freshly generated ids (pairs only, no chains).
      built.forEach((item, i) => {
        const pi = templates[i].linkedToIdx;
        if (typeof pi !== "number" || pi === i || !built[pi] || templates[pi].linkedToIdx != null) return;
        item.linkedTo = built[pi].id;
        item.initiative = built[pi].initiative;
        item.autoRolled = built[pi].autoRolled;
      });
      // Parents first, so children can be placed right behind them.
      addToList([...built.filter(x => !x.linkedTo), ...built.filter(x => x.linkedTo)]);
    };
    const saveEnemyTemplate = () => {
      const raw = enemyForm.name.trim();
      if (!raw) return;
      const name = stripLeadingColor(raw) || raw;
      setSavedEnemyTemplates(prev => ({
        ...prev,
        [name]: {
          maxHp: enemyForm.maxHp,
          mod: enemyForm.mod,
          cr: enemyForm.cr,
          color: enemyForm.color,
          advanced: enemyForm.advanced
        }
      }));
    };
    const loadEnemyTemplate = name => {
      const t = savedEnemyTemplates[name];
      if (!t) return;
      setEnemyForm(f => ({
        ...f,
        name,
        maxHp: t.maxHp,
        mod: t.mod,
        cr: t.cr,
        color: t.color,
        advanced: t.advanced || makeDefaultAdvanced()
      }));
    };
    const deleteEnemyTemplate = name => {
      requestConfirm(`Delete saved enemy "${name}"? This can't be undone.`, () => {
        setSavedEnemyTemplates(prev => {
          const next = {
            ...prev
          };
          delete next[name];
          return next;
        });
        setSelectedEnemyTemplate("");
      });
    };
    const saveNpcTemplate = () => {
      const name = npcForm.name.trim();
      if (!name) return;
      setSavedNpcTemplates(prev => ({
        ...prev,
        [name]: {
          maxHp: npcForm.maxHp,
          mod: npcForm.mod,
          advanced: npcForm.advanced
        }
      }));
    };
    const loadNpcTemplate = name => {
      const t = savedNpcTemplates[name];
      if (!t) return;
      setNpcForm(f => ({
        ...f,
        name,
        maxHp: t.maxHp,
        mod: t.mod,
        advanced: t.advanced || makeDefaultAdvanced()
      }));
    };
    const deleteNpcTemplate = name => {
      requestConfirm(`Delete saved NPC "${name}"? This can't be undone.`, () => {
        setSavedNpcTemplates(prev => {
          const next = {
            ...prev
          };
          delete next[name];
          return next;
        });
        setSelectedNpcTemplate("");
      });
    };
    const exportData = () => {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        state: {
          combatants,
          round,
          turnsThisRound,
          inCombat,
          partyLevel,
          partySize,
          rollPlayersInitiative
        },
        encounters: savedEncounters,
        parties: savedParties,
        enemyTemplates: savedEnemyTemplates,
        npcTemplates: savedNpcTemplates
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `initlite-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const triggerImport = () => {
      setImportError("");
      if (importInputRef.current) importInputRef.current.click();
    };
    const handleImportFile = e => {
      const file = e.target.files && e.target.files[0];
      e.target.value = ""; // allow re-selecting the same file later
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        let payload;
        try {
          payload = JSON.parse(ev.target.result);
        } catch (err) {
          setImportError("That file doesn't look like a valid init.Lite backup (not valid JSON).");
          return;
        }
        if (!payload || typeof payload !== "object") {
          setImportError("That file doesn't look like a valid init.Lite backup.");
          return;
        }
        requestConfirm("Import will overwrite all data on this device — combatants, saved parties, encounters, and the enemy/NPC library. Continue?", () => {
          if (payload.state) localStorage.setItem(STATE_KEY, JSON.stringify(payload.state));
          if (payload.encounters) localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(payload.encounters));
          if (payload.parties) localStorage.setItem(PARTIES_KEY, JSON.stringify(payload.parties));
          if (payload.enemyTemplates) localStorage.setItem(ENEMY_TEMPLATES_KEY, JSON.stringify(payload.enemyTemplates));
          if (payload.npcTemplates) localStorage.setItem(NPC_TEMPLATES_KEY, JSON.stringify(payload.npcTemplates));
          window.location.reload();
        });
      };
      reader.readAsText(file);
    };
    const deleteEncounter = name => {
      requestConfirm(`Delete saved encounter "${name}"? This can't be undone.`, () => {
        setSavedEncounters(prev => {
          const next = {
            ...prev
          };
          delete next[name];
          return next;
        });
        if (selectedEncounter === name) setSelectedEncounter("");
      });
    };
    const saveParty = () => {
      const name = partyName.trim();
      if (!name) return;
      const templates = combatants.filter(c => c.type === "player").map(c => ({
        name: c.name,
        initMod: c.initMod || 0
      }));
      if (templates.length === 0) return;
      setSavedParties(prev => ({
        ...prev,
        [name]: templates
      }));
      setPartyName("");
    };
    const loadParty = () => {
      if (!selectedParty || !savedParties[selectedParty]) return;
      const templates = savedParties[selectedParty];
      addToList(templates.map(t => makePlayer(t.name, t.initMod)));
    };
    const deleteParty = name => {
      requestConfirm(`Delete saved party "${name}"? This can't be undone.`, () => {
        setSavedParties(prev => {
          const next = {
            ...prev
          };
          delete next[name];
          return next;
        });
        if (selectedParty === name) setSelectedParty("");
      });
    };
    const aliveOrder = combatants.filter(c => c.status !== "dead");
    const deadCombatants = combatants.filter(c => c.status === "dead");
    const aliveUnits = buildUnits(aliveOrder);
    const dividerIndex = inCombat ? clamp(aliveUnits.length - turnsThisRound, 0, aliveUnits.length) : -1;
    const chainStateFor = cmb => {
      if (linkedIds.has(cmb.id)) return "linked";
      if (activeLinkSource) return activeLinkSource.id === cmb.id ? "selected" : "target";
      return "idle";
    };
    const cardProps = cmb => ({
      c: cmb,
      inCombat,
      onUpdate: patch => updateCombatant(cmb.id, patch),
      onRemove: () => removeCombatant(cmb.id),
      onEndTurn: endTurn,
      onInitChange: val => setInitiative(cmb.id, val),
      onSetClipboard: () => setClipboardFromCard(cmb),
      onChain: () => handleChain(cmb.id),
      chainState: chainStateFor(cmb)
    });
    const partyCount = partySize.trim() !== "" ? parseInt(partySize, 10) : combatants.filter(c => c.type === "player").length;
    const parsedLevel = parseInt(partyLevel, 10);
    const difficulty = computeDifficulty(combatants.filter(c => c.type === "enemy"), parsedLevel, partyCount);
    const DIFFICULTY_STYLE = {
      Trivial: "bg-neutral-800 text-neutral-400 border-neutral-600",
      Easy: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
      Medium: "bg-amber-900/40 text-amber-300 border-amber-700",
      Hard: "bg-orange-900/40 text-orange-300 border-orange-700",
      Deadly: "bg-rose-900/40 text-rose-300 border-rose-700"
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 pb-24 sm:pb-24"
    }, /*#__PURE__*/React.createElement(DiceRoller, null), /*#__PURE__*/React.createElement("div", {
      className: "max-w-2xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 items-center mb-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onSwitch ? setShowModeMenu(true) : null,
      "aria-label": "Switch mode",
      title: "Switch mode",
      className: "w-9 h-9 rounded-lg overflow-hidden shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_ICON,
      alt: "",
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "hidden sm:block text-lg font-bold tracking-tight"
    }, "TableQuest"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowInfoModal(true),
      title: "About & Credits",
      className: "text-neutral-500 hover:text-neutral-300 shrink-0"
    }, /*#__PURE__*/React.createElement(IconInfo, {
      className: "w-4 h-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowDifficultyPopover(v => !v),
      title: "Encounter difficulty",
      className: `w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${showDifficultyPopover ? "bg-amber-500 border-amber-400 text-neutral-950" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"}`
    }, /*#__PURE__*/React.createElement(IconScale, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowSettingsPopover(v => !v),
      title: "Settings",
      className: `w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${showSettingsPopover ? "bg-amber-500 border-amber-400 text-neutral-950" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"}`
    }, /*#__PURE__*/React.createElement(IconSettings, {
      className: "w-4 h-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowClearResetModal(true),
      disabled: inCombat,
      title: inCombat ? "Can't clear/reset mid-initiative" : "Clear or reset",
      className: `w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${inCombat ? "text-neutral-600 border-neutral-900 opacity-40 cursor-not-allowed" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-rose-800 hover:text-rose-300"}`
    }, /*#__PURE__*/React.createElement(IconTrash, {
      className: "w-4 h-4"
    })))), showSettingsPopover && /*#__PURE__*/React.createElement("div", {
      className: "mb-3 rounded-lg border border-neutral-700 bg-neutral-800/20 p-3 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => setRollPlayersInitiative(v => !v),
      className: "text-xs text-neutral-400 cursor-pointer select-none"
    }, "Roll initiative for players"), /*#__PURE__*/React.createElement(PillSwitch, {
      checked: rollPlayersInitiative,
      onClick: () => setRollPlayersInitiative(v => !v),
      title: "Roll initiative for players"
    })), showDifficultyPopover && /*#__PURE__*/React.createElement("div", {
      className: "mb-3 rounded-lg border border-amber-900/50 bg-amber-950/10 p-3 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1 text-xs text-neutral-400 shrink-0",
      title: "Average Party Level"
    }, /*#__PURE__*/React.createElement(IconScale, {
      className: "w-3.5 h-3.5"
    }), " Level"), /*#__PURE__*/React.createElement("input", {
      value: partyLevel,
      onChange: e => setPartyLevel(e.target.value),
      placeholder: "e.g. 5",
      inputMode: "numeric",
      className: "w-14 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-amber-500 placeholder:text-neutral-600"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1 text-xs text-neutral-400 shrink-0",
      title: "Party Size"
    }, /*#__PURE__*/React.createElement(IconUsers, {
      className: "w-3.5 h-3.5"
    }), " Size"), /*#__PURE__*/React.createElement("input", {
      value: partySize,
      onChange: e => setPartySize(e.target.value),
      placeholder: "auto",
      inputMode: "numeric",
      className: "w-14 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-amber-500 placeholder:text-neutral-600"
    }))), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "Enables approximate encounter difficulty. Manual party size for encounter building.")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-neutral-800 bg-neutral-900/40 mb-3"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowEditor(v => !v),
      className: "w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-neutral-300"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(IconToolbox, {
      className: "w-4 h-4"
    }), " Editor"), /*#__PURE__*/React.createElement(IconChevronDown, {
      className: `w-3.5 h-3.5 transition-transform ${showEditor ? "rotate-180" : ""}`
    })), showEditor && /*#__PURE__*/React.createElement("div", {
      className: "px-3 pb-3 space-y-2"
    }, /*#__PURE__*/React.createElement(EditorSection, {
      title: "Add Player",
      icon: /*#__PURE__*/React.createElement(IconShield, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-sky-900/50",
        bg: "bg-sky-950/10",
        text: "text-sky-300"
      },
      open: showPlayerForm,
      onToggle: () => setShowPlayerForm(v => !v)
    }, getSheetChars && /*#__PURE__*/React.createElement(SheetPcPicker, {
      chars: getSheetChars(),
      present: combatants.filter(x => x.type === "player").map(x => x.name.toLowerCase()),
      onAdd: list => addToList(list.map(p => makePlayer(p.name, p.initMod)))
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: playerForm.name,
      onChange: e => setPlayerForm({
        ...playerForm,
        name: e.target.value
      }),
      onKeyDown: e => e.key === "Enter" && addPlayer(),
      placeholder: "Name",
      className: "w-2/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-sky-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: playerForm.initMod,
      onChange: e => setPlayerForm({
        ...playerForm,
        initMod: e.target.value
      }),
      onKeyDown: e => e.key === "Enter" && addPlayer(),
      placeholder: "+0 (init mod)",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-sky-500 placeholder:text-neutral-600"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "Starts at initiative 10 — edit anytime on the card. Init mod only applies if \"Roll for Players\" is on."), /*#__PURE__*/React.createElement("button", {
      onClick: addPlayer,
      className: "w-full flex items-center justify-center gap-1 text-sm font-medium bg-sky-600 hover:bg-sky-500 rounded py-1.5"
    }, "+ Add Player")), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Add NPC",
      icon: /*#__PURE__*/React.createElement(IconMask, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-stone-600/50",
        bg: "bg-stone-800/10",
        text: "text-stone-300"
      },
      open: showNpcForm,
      onToggle: () => setShowNpcForm(v => !v)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowNpcLibrary(v => !v),
      className: "flex items-center gap-1 text-xs text-stone-300 hover:text-stone-200"
    }, /*#__PURE__*/React.createElement(IconLibrary, {
      className: "w-3.5 h-3.5"
    }), " Saved NPCs ", /*#__PURE__*/React.createElement(IconChevronDown, {
      className: `w-3 h-3 transition-transform ${showNpcLibrary ? "rotate-180" : ""}`
    })), showNpcLibrary && /*#__PURE__*/React.createElement("div", {
      className: "mt-1.5 rounded-lg border border-neutral-700 bg-neutral-900 p-2 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("select", {
      value: selectedNpcTemplate,
      onChange: e => setSelectedNpcTemplate(e.target.value),
      className: "flex-1 min-w-0 text-xs bg-neutral-950 border border-neutral-700 rounded px-2 py-1 outline-none focus:border-stone-400 text-neutral-200"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Choose…"), Object.keys(savedNpcTemplates).sort((a, b) => a.localeCompare(b)).map(name => /*#__PURE__*/React.createElement("option", {
      key: name,
      value: name
    }, name))), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedNpcTemplate && loadNpcTemplate(selectedNpcTemplate),
      disabled: !selectedNpcTemplate,
      className: "text-xs px-2 py-1 rounded bg-stone-600 hover:bg-stone-500 disabled:opacity-40 text-white shrink-0"
    }, "Load"), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedNpcTemplate && deleteNpcTemplate(selectedNpcTemplate),
      disabled: !selectedNpcTemplate,
      className: "text-xs text-neutral-400 hover:text-rose-300 disabled:opacity-40 shrink-0 px-1"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-3.5 h-3.5"
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: saveNpcTemplate,
      disabled: !npcForm.name.trim(),
      className: "w-full flex items-center justify-center gap-1 text-xs px-2 py-1 rounded bg-stone-600 hover:bg-stone-500 disabled:opacity-40 text-white"
    }, /*#__PURE__*/React.createElement(IconSave, {
      className: "w-3.5 h-3.5"
    }), " Save Current As ", npcForm.name.trim() ? `"${npcForm.name.trim()}"` : "…"))), /*#__PURE__*/React.createElement("input", {
      value: npcForm.name,
      onChange: e => setNpcForm({
        ...npcForm,
        name: e.target.value
      }),
      placeholder: "Name",
      className: "w-full text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-stone-400 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: npcForm.qty,
      onChange: e => setNpcForm({
        ...npcForm,
        qty: e.target.value
      }),
      placeholder: "1 (quantity)",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-stone-400 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: npcForm.maxHp,
      onChange: e => setNpcForm({
        ...npcForm,
        maxHp: e.target.value
      }),
      placeholder: "HP",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-stone-400 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: npcForm.mod,
      onChange: e => setNpcForm({
        ...npcForm,
        mod: e.target.value
      }),
      onKeyDown: e => e.key === "Enter" && addNpcs(),
      placeholder: "+0",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-stone-400 placeholder:text-neutral-600"
    })), /*#__PURE__*/React.createElement(AdvancedFieldsEditor, {
      value: npcForm.advanced,
      onChange: adv => setNpcForm({
        ...npcForm,
        advanced: adv
      }),
      accent: "text-stone-300"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: addNpcs,
      className: "w-full flex items-center justify-center gap-1 text-sm font-medium bg-stone-600 hover:bg-stone-500 rounded py-1.5"
    }, "+ Add NPC")), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Add Enemy",
      icon: /*#__PURE__*/React.createElement(IconSwords, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-rose-900/50",
        bg: "bg-rose-950/10",
        text: "text-rose-300"
      },
      open: showEnemyForm,
      onToggle: () => setShowEnemyForm(v => !v)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowEnemyLibrary(v => !v),
      className: "flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200"
    }, /*#__PURE__*/React.createElement(IconLibrary, {
      className: "w-3.5 h-3.5"
    }), " Saved Enemies ", /*#__PURE__*/React.createElement(IconChevronDown, {
      className: `w-3 h-3 transition-transform ${showEnemyLibrary ? "rotate-180" : ""}`
    })), showEnemyLibrary && /*#__PURE__*/React.createElement("div", {
      className: "mt-1.5 rounded-lg border border-neutral-700 bg-neutral-900 p-2 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("select", {
      value: selectedEnemyTemplate,
      onChange: e => setSelectedEnemyTemplate(e.target.value),
      className: "flex-1 min-w-0 text-xs bg-neutral-950 border border-neutral-700 rounded px-2 py-1 outline-none focus:border-rose-500 text-neutral-200"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Choose…"), Object.keys(savedEnemyTemplates).sort((a, b) => a.localeCompare(b)).map(name => /*#__PURE__*/React.createElement("option", {
      key: name,
      value: name
    }, name))), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedEnemyTemplate && loadEnemyTemplate(selectedEnemyTemplate),
      disabled: !selectedEnemyTemplate,
      className: "text-xs px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white shrink-0"
    }, "Load"), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedEnemyTemplate && deleteEnemyTemplate(selectedEnemyTemplate),
      disabled: !selectedEnemyTemplate,
      className: "text-xs text-neutral-400 hover:text-rose-300 disabled:opacity-40 shrink-0 px-1"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-3.5 h-3.5"
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: saveEnemyTemplate,
      disabled: !enemyForm.name.trim(),
      className: "w-full flex items-center justify-center gap-1 text-xs px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white"
    }, /*#__PURE__*/React.createElement(IconSave, {
      className: "w-3.5 h-3.5"
    }), " Save Current As ", enemyForm.name.trim() ? `"${stripLeadingColor(enemyForm.name.trim()) || enemyForm.name.trim()}"` : "…"))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5"
    }, ENEMY_COLORS.map(col => /*#__PURE__*/React.createElement("button", {
      key: col.name,
      title: col.name,
      onClick: () => pickColor(col),
      className: `w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${enemyForm.color === col.hex ? "border-amber-400 ring-2 ring-amber-400 scale-110" : "border-neutral-700"}`,
      style: {
        backgroundColor: col.hex
      }
    }))), /*#__PURE__*/React.createElement("input", {
      value: enemyForm.name,
      onChange: e => setEnemyForm({
        ...enemyForm,
        name: e.target.value
      }),
      placeholder: "Name (or pick a color)",
      className: "w-full text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-rose-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: enemyForm.qty,
      onChange: e => setEnemyForm({
        ...enemyForm,
        qty: e.target.value
      }),
      placeholder: "1 (quantity)",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-rose-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: enemyForm.maxHp,
      onChange: e => setEnemyForm({
        ...enemyForm,
        maxHp: e.target.value
      }),
      placeholder: "HP",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-rose-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("input", {
      value: enemyForm.mod,
      onChange: e => setEnemyForm({
        ...enemyForm,
        mod: e.target.value
      }),
      onKeyDown: e => e.key === "Enter" && addEnemies(),
      placeholder: "+0 (init mod)",
      inputMode: "numeric",
      className: "w-1/3 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-rose-500 placeholder:text-neutral-600"
    })), /*#__PURE__*/React.createElement(AdvancedFieldsEditor, {
      value: enemyForm.advanced,
      onChange: adv => setEnemyForm({
        ...enemyForm,
        advanced: adv
      }),
      accent: "text-rose-300",
      cr: enemyForm.cr,
      onCrChange: v => setEnemyForm({
        ...enemyForm,
        cr: v
      })
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: addEnemies,
      className: "flex-1 flex items-center justify-center gap-1 text-sm font-medium bg-rose-600 hover:bg-rose-500 rounded py-1.5"
    }, "+ Add Enemy"), enemyClipboard && /*#__PURE__*/React.createElement("button", {
      onClick: duplicateEnemy,
      title: "Duplicate from clipboard",
      className: "px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-sm shrink-0 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IconClipboard, {
      className: "w-4 h-4"
    })))), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Add Marker",
      icon: /*#__PURE__*/React.createElement(IconFlag, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-indigo-900/50",
        bg: "bg-indigo-950/10",
        text: "text-indigo-300"
      },
      open: showMarkerForm,
      onToggle: () => setShowMarkerForm(v => !v)
    }, /*#__PURE__*/React.createElement("input", {
      value: markerForm.name,
      onChange: e => setMarkerForm({
        ...markerForm,
        name: e.target.value
      }),
      placeholder: "e.g. Lair Actions",
      className: "w-full text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-indigo-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500 shrink-0"
    }, "Initiative"), /*#__PURE__*/React.createElement("input", {
      value: markerForm.initiative,
      onChange: e => setMarkerForm({
        ...markerForm,
        initiative: e.target.value
      }),
      onKeyDown: e => e.key === "Enter" && addMarker(),
      inputMode: "numeric",
      className: "w-16 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-indigo-500"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "Defaults to 20 — edit anytime on the card.")), /*#__PURE__*/React.createElement("button", {
      onClick: addMarker,
      className: "w-full flex items-center justify-center gap-1 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded py-1.5"
    }, /*#__PURE__*/React.createElement(IconFlag, {
      className: "w-4 h-4"
    }), " Add Marker")), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Saved Encounters",
      icon: /*#__PURE__*/React.createElement(IconBookOpen, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-violet-900/50",
        bg: "bg-violet-950/10",
        text: "text-violet-300"
      },
      open: showEncounterForm,
      onToggle: () => setShowEncounterForm(v => !v)
    }, /*#__PURE__*/React.createElement("input", {
      value: encounterName,
      onChange: e => setEncounterName(e.target.value),
      placeholder: "Name this encounter",
      className: "w-full text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-violet-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: saveEncounter,
      className: "w-full text-sm font-medium bg-violet-700 hover:bg-violet-600 rounded py-1.5"
    }, "Save current enemies & NPCs"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("select", {
      value: selectedEncounter,
      onChange: e => setSelectedEncounter(e.target.value),
      className: "flex-1 min-w-0 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-violet-500 text-neutral-200"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Choose…"), Object.keys(savedEncounters).map(name => /*#__PURE__*/React.createElement("option", {
      key: name,
      value: name
    }, name, " (", savedEncounters[name].length, ")"))), /*#__PURE__*/React.createElement("button", {
      onClick: loadEncounter,
      disabled: !selectedEncounter,
      className: "text-sm font-medium bg-violet-700 hover:bg-violet-600 disabled:opacity-40 rounded px-3 py-1.5 shrink-0"
    }, "Load"), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedEncounter && deleteEncounter(selectedEncounter),
      disabled: !selectedEncounter,
      className: "text-sm text-neutral-400 hover:text-rose-300 disabled:opacity-40 rounded px-2 py-1.5 shrink-0 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-4 h-4"
    })))), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Saved Parties",
      icon: /*#__PURE__*/React.createElement(IconUsers, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-teal-900/50",
        bg: "bg-teal-950/10",
        text: "text-teal-300"
      },
      open: showPartyForm,
      onToggle: () => setShowPartyForm(v => !v)
    }, /*#__PURE__*/React.createElement("input", {
      value: partyName,
      onChange: e => setPartyName(e.target.value),
      placeholder: "Name this party",
      className: "w-full text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-teal-500 placeholder:text-neutral-600"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: saveParty,
      className: "w-full text-sm font-medium bg-teal-700 hover:bg-teal-600 rounded py-1.5"
    }, "Save current players"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement("select", {
      value: selectedParty,
      onChange: e => setSelectedParty(e.target.value),
      className: "flex-1 min-w-0 text-sm bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 outline-none focus:border-teal-500 text-neutral-200"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Choose…"), Object.keys(savedParties).map(name => /*#__PURE__*/React.createElement("option", {
      key: name,
      value: name
    }, name, " (", savedParties[name].length, ")"))), /*#__PURE__*/React.createElement("button", {
      onClick: loadParty,
      disabled: !selectedParty,
      className: "text-sm font-medium bg-teal-700 hover:bg-teal-600 disabled:opacity-40 rounded px-3 py-1.5 shrink-0"
    }, "Load"), /*#__PURE__*/React.createElement("button", {
      onClick: () => selectedParty && deleteParty(selectedParty),
      disabled: !selectedParty,
      className: "text-sm text-neutral-400 hover:text-rose-300 disabled:opacity-40 rounded px-2 py-1.5 shrink-0 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-4 h-4"
    })))), /*#__PURE__*/React.createElement(EditorSection, {
      title: "Backup & Restore",
      icon: /*#__PURE__*/React.createElement(IconSave, {
        className: "w-4 h-4"
      }),
      accent: {
        border: "border-neutral-700/50",
        bg: "bg-neutral-800/20",
        text: "text-neutral-300"
      },
      open: showBackupForm,
      onToggle: () => setShowBackupForm(v => !v)
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "Move everything — combatants, saved parties, encounters, and the enemy/NPC library — between your devices as a file."), /*#__PURE__*/React.createElement("button", {
      onClick: exportData,
      className: "w-full flex items-center justify-center gap-1 text-sm font-medium bg-neutral-700 hover:bg-neutral-600 rounded py-1.5"
    }, /*#__PURE__*/React.createElement(IconDownload, {
      className: "w-4 h-4"
    }), " Export Data"), /*#__PURE__*/React.createElement("button", {
      onClick: triggerImport,
      className: "w-full flex items-center justify-center gap-1 text-sm font-medium bg-neutral-700 hover:bg-neutral-600 rounded py-1.5"
    }, /*#__PURE__*/React.createElement(IconUpload, {
      className: "w-4 h-4"
    }), " Import Data"), /*#__PURE__*/React.createElement("input", {
      ref: importInputRef,
      type: "file",
      accept: ".json,application/json",
      onChange: handleImportFile,
      className: "hidden"
    }), importError && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-rose-400"
    }, importError)))), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500 text-center my-3"
    }, inCombat ? /*#__PURE__*/React.createElement(React.Fragment, null, "Round ", /*#__PURE__*/React.createElement("span", {
      className: `font-bold transition-colors duration-700 ${roundFlash ? "text-amber-400" : "text-neutral-500"}`
    }, round), " · ") : "Setting up · ", combatants.length, " combatant", combatants.length !== 1 ? "s" : ""), difficulty && /*#__PURE__*/React.createElement("div", {
      className: `w-full mb-3 flex items-center justify-between text-xs rounded-lg border px-3 py-2 ${DIFFICULTY_STYLE[difficulty.band]}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1 font-semibold"
    }, /*#__PURE__*/React.createElement(IconScale, {
      className: "w-3.5 h-3.5"
    }), " ", difficulty.band, " encounter"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono opacity-80"
    }, "~", difficulty.adjustedXP, " adj. XP ", difficulty.missingCr > 0 ? `(${difficulty.missingCr} enemy w/o CR)` : "")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mb-5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: inCombat ? () => setShowEndInitiativeModal(true) : rollInitiative,
      className: `flex-1 flex items-center justify-center gap-1.5 text-sm font-bold rounded-lg py-2.5 transition-colors ${inCombat ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700" : "bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950"}`
    }, inCombat ? /*#__PURE__*/React.createElement(IconStop, {
      className: "w-4 h-4"
    }) : /*#__PURE__*/React.createElement(IconD20, {
      className: "w-4 h-4"
    }), " ", inCombat ? "End Initiative" : "Roll Initiative"), (inCombat || canResume) && /*#__PURE__*/React.createElement("button", {
      onClick: inCombat ? undoEndTurn : resumeInitiative,
      disabled: inCombat && turnHistory.length === 0,
      title: inCombat ? "Undo last End Turn" : "Resume the initiative you just ended, with the same rolls",
      "aria-label": inCombat ? "Undo last End Turn" : "Resume previous initiative",
      className: `px-4 rounded-lg border transition-colors flex items-center justify-center ${inCombat && turnHistory.length === 0 ? "opacity-30 cursor-not-allowed border-neutral-800 text-neutral-600" : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"}`
    }, inCombat ? /*#__PURE__*/React.createElement(IconUndo, {
      className: "w-4 h-4"
    }) : /*#__PURE__*/React.createElement(IconRewind, {
      className: "w-4 h-4"
    }))), activeLinkSource && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-orange-400 text-center text-balance -mt-3 mb-3"
    }, "Linking ", activeLinkSource.name, " — tap another chain, or tap again to cancel."), inCombat && !currentCardVisible && aliveUnits[0] && /*#__PURE__*/React.createElement("div", {
      className: "fixed top-0 left-0 right-0 z-20 bg-amber-500 text-neutral-950 px-4 py-2 flex items-center justify-between shadow-lg"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1 text-sm font-bold truncate"
    }, /*#__PURE__*/React.createElement(IconChevronRight, {
      className: "w-4 h-4 shrink-0"
    }), " ", aliveUnits[0].map(m => m.name).join(" + "), "'s turn"), /*#__PURE__*/React.createElement("button", {
      onClick: endTurn,
      className: "text-xs font-bold bg-neutral-950 text-amber-400 rounded px-3 py-1.5 shrink-0 ml-2"
    }, "End Turn")), combatants.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "text-center py-16 text-neutral-600 border border-dashed border-neutral-800 rounded-xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-2xl mb-2 opacity-50"
    }, "♥"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm"
    }, "Add combatants to begin the encounter.")) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, aliveUnits.map((unit, u) => {
      const [leader, ...kids] = unit;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: leader.id
      }, u === dividerIndex && /*#__PURE__*/React.createElement(RoundDivider, null), /*#__PURE__*/React.createElement(CombatantCard, {
        ...cardProps(leader),
        isCurrent: u === 0,
        cardRef: u === 0 ? currentCardRef : null
      }), kids.map(kid => /*#__PURE__*/React.createElement("div", {
        key: kid.id,
        "data-link-child": "true",
        className: "relative ml-6"
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        "data-link-line": "true",
        className: "absolute border-l-2 border-b-2 border-emerald-500/70 rounded-bl-lg pointer-events-none",
        style: {
          left: "-0.875rem",
          top: "-0.625rem",
          width: "0.875rem",
          height: "2.375rem"
        }
      }), /*#__PURE__*/React.createElement(CombatantCard, {
        ...cardProps(kid),
        isCurrent: u === 0,
        hideEndTurn: true,
        isLinkedChild: true,
        linkedParentName: leader.name
      }))));
    }), dividerIndex === aliveUnits.length && aliveUnits.length > 0 && /*#__PURE__*/React.createElement(RoundDivider, null), deadCombatants.map(c => /*#__PURE__*/React.createElement(CombatantCard, {
      key: c.id,
      ...cardProps(c),
      isCurrent: false
    })))), confirmDialog && /*#__PURE__*/React.createElement(ConfirmModal, {
      message: confirmDialog.message,
      onCancel: () => setConfirmDialog(null),
      onConfirm: () => {
        confirmDialog.onConfirm();
        setConfirmDialog(null);
      }
    }), showEndInitiativeModal && /*#__PURE__*/React.createElement(EndInitiativeModal, {
      onEnd: () => {
        endInitiative();
        setShowEndInitiativeModal(false);
      },
      onReroll: () => {
        reRollInitiative();
        setShowEndInitiativeModal(false);
      },
      onCancel: () => setShowEndInitiativeModal(false)
    }), showModeMenu && onSwitch && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4",
      onClick: () => setShowModeMenu(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-xs rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl",
      onClick: e => e.stopPropagation(),
      role: "dialog",
      "aria-label": "Mode"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold text-neutral-200 mb-3"
    }, "TableQuest: Game Master"), /*#__PURE__*/React.createElement("button", {
      onClick: onSwitch,
      "aria-label": "Switch to Player mode",
      className: "w-full rounded-lg border border-amber-700/70 bg-amber-950/30 hover:bg-amber-950/50 text-amber-200 text-sm font-semibold py-2.5"
    }, "Switch to Player mode"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowModeMenu(false),
      className: "w-full mt-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold py-2"
    }, "Cancel"))), showInfoModal && /*#__PURE__*/React.createElement(InfoModal, {
      onClose: () => setShowInfoModal(false)
    }), showClearResetModal && /*#__PURE__*/React.createElement(ClearResetModal, {
      onClearEnemies: () => {
        clearEnemies();
        setShowClearResetModal(false);
      },
      onResetAll: () => {
        resetAll();
        setShowClearResetModal(false);
      },
      onCancel: () => setShowClearResetModal(false)
    }));
  }
  return CombatTracker;
})();
const SheetApp = (() => {
  const {
    useState,
    useEffect,
    useRef,
    useContext,
    createContext
  } = React;

  // ───────────────────────── helpers ─────────────────────────
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const num = v => {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  };
  const rnd = sides => Math.floor(Math.random() * sides) + 1;
  const sum = a => a.reduce((x, y) => x + y, 0);
  const fmt = n => n >= 0 ? `+${n}` : `−${Math.abs(n)}`;
  const abilityMod = score => Math.floor((num(score) - 10) / 2);
  const profBonusFor = level => Math.ceil(clamp(num(level) || 1, 1, 20) / 4) + 1;
  const ABILITIES = [["str", "Strength", "STR"], ["dex", "Dexterity", "DEX"], ["con", "Constitution", "CON"], ["int", "Intelligence", "INT"], ["wis", "Wisdom", "WIS"], ["cha", "Charisma", "CHA"]];
  const SKILLS = [["acrobatics", "Acrobatics", "dex"], ["animalHandling", "Animal Handling", "wis"], ["arcana", "Arcana", "int"], ["athletics", "Athletics", "str"], ["deception", "Deception", "cha"], ["history", "History", "int"], ["insight", "Insight", "wis"], ["intimidation", "Intimidation", "cha"], ["investigation", "Investigation", "int"], ["medicine", "Medicine", "wis"], ["nature", "Nature", "int"], ["perception", "Perception", "wis"], ["performance", "Performance", "cha"], ["persuasion", "Persuasion", "cha"], ["religion", "Religion", "int"], ["sleightOfHand", "Sleight of Hand", "dex"], ["stealth", "Stealth", "dex"], ["survival", "Survival", "wis"]];
  const CONDITIONS = ["Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious"];
  const COMMON_ACTIONS = [["Attack", "Make one weapon attack (more with Extra Attack), or cast a cantrip."], ["Dash", "Gain extra movement equal to your speed for the turn."], ["Disengage", "Your movement doesn't provoke opportunity attacks this turn."], ["Dodge", "Attacks against you have disadvantage; advantage on Dexterity saves."], ["Help", "Give an ally advantage on their next check or attack against a target."], ["Hide", "Make a Dexterity (Stealth) check to become hidden."], ["Ready", "Prepare a reaction to a trigger you choose."], ["Search", "Make a Wisdom (Perception) or Intelligence (Investigation) check."], ["Use an Object", "Interact with a second object, or use a special item."], ["Grapple / Shove", "Replace one attack with a Strength (Athletics) contest."]];
  const COIN_TYPES = ["cp", "sp", "ep", "gp", "pp"];
  const FEATURE_SOURCES = ["Class", "Subclass", "Species", "Background", "Feat", "Item", "Other"];

  // Labels that differ between the 2014 and 2024 rules.
  const labelsFor = ruleset => ruleset === "2014" ? {
    species: "Race",
    inspiration: "Inspiration",
    showXp: true
  } : {
    species: "Species",
    inspiration: "Heroic Inspiration",
    showXp: false
  };

  // ───────────────────────── character model ─────────────────────────
  function newChar(name) {
    const skillProf = {};
    SKILLS.forEach(([k]) => {
      skillProf[k] = 0;
    });
    const slots = {};
    for (let i = 1; i <= 9; i++) slots[i] = {
      max: 0,
      used: 0
    };
    return {
      id: uid(),
      name: name || "New Character",
      cls: "",
      subclass: "",
      level: 1,
      species: "",
      background: "",
      alignment: "",
      xp: "",
      portrait: "",
      abilities: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
      },
      saveProf: {
        str: false,
        dex: false,
        con: false,
        int: false,
        wis: false,
        cha: false
      },
      skillProf,
      hp: {
        cur: 10,
        max: 10,
        temp: 0
      },
      hitDie: 8,
      hitDiceUsed: 0,
      deathSaves: {
        s: 0,
        f: 0
      },
      ac: 10,
      speed: "30 ft.",
      initMisc: 0,
      inspiration: false,
      conditions: [],
      exhaustion: 0,
      concentrating: "",
      economy: {
        action: false,
        bonus: false,
        reaction: false,
        moved: 0
      },
      attacks: [],
      resources: [],
      slotsHidden: false,
      spellAbility: "",
      slots,
      spells: [],
      features: [],
      items: [],
      coins: {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0
      },
      bio: {
        traits: "",
        ideals: "",
        bonds: "",
        flaws: "",
        appearance: "",
        armorProf: "",
        weaponProf: "",
        toolProf: "",
        languages: "",
        notes: ""
      }
    };
  }
  function sampleChar() {
    const c = newChar("Seraphine Vale");
    c.cls = "Wizard";
    c.subclass = "Evoker";
    c.level = 3;
    c.species = "Elf (High)";
    c.background = "Sage";
    c.alignment = "Neutral Good";
    c.abilities = {
      str: 8,
      dex: 14,
      con: 14,
      int: 17,
      wis: 12,
      cha: 10
    };
    c.saveProf = {
      str: false,
      dex: false,
      con: false,
      int: true,
      wis: true,
      cha: false
    };
    ["arcana", "history", "investigation", "insight"].forEach(k => {
      c.skillProf[k] = 1;
    });
    c.hp = {
      cur: 18,
      max: 18,
      temp: 0
    };
    c.hitDie = 6;
    c.ac = 12;
    c.speed = "30 ft.";
    c.attacks = [{
      id: uid(),
      name: "Fire Bolt",
      bonus: "5",
      damage: "1d10",
      type: "fire",
      notes: "Cantrip · 120 ft."
    }, {
      id: uid(),
      name: "Quarterstaff",
      bonus: "1",
      damage: "1d6-1",
      type: "bludgeoning",
      notes: "Versatile 1d8"
    }, {
      id: uid(),
      name: "Dagger",
      bonus: "4",
      damage: "1d4+2",
      type: "piercing",
      notes: "Finesse, light, thrown 20/60"
    }];
    c.spellAbility = "int";
    c.resources = [{
      id: uid(),
      kind: "custom",
      name: "Wand of Magic Missiles",
      max: 7,
      used: 2,
      recharge: "long"
    }];
    c.slots[1] = {
      max: 4,
      used: 1
    };
    c.slots[2] = {
      max: 2,
      used: 0
    };
    const sp = (name, level, o = {}) => ({
      id: uid(),
      name,
      level,
      prepared: level === 0 ? true : !!o.prepared,
      conc: !!o.conc,
      ritual: !!o.ritual,
      notes: o.notes || ""
    });
    c.spells = [sp("Fire Bolt", 0, {
      notes: "Ranged spell attack, 120 ft. 1d10 fire (2d10 at level 5)."
    }), sp("Mage Hand", 0, {
      notes: "Spectral hand, 30 ft., lasts 1 minute."
    }), sp("Prestidigitation", 0, {
      notes: "Minor magical tricks."
    }), sp("Ray of Frost", 0, {
      notes: "1d8 cold, speed reduced by 10 ft."
    }), sp("Magic Missile", 1, {
      prepared: true,
      notes: "3 darts, 1d4+1 force each. Auto-hit."
    }), sp("Shield", 1, {
      prepared: true,
      notes: "Reaction: +5 AC until start of next turn."
    }), sp("Mage Armor", 1, {
      prepared: true,
      notes: "AC 13 + Dex for 8 hours."
    }), sp("Detect Magic", 1, {
      prepared: true,
      ritual: true,
      conc: true,
      notes: "Sense magic within 30 ft. for 10 minutes."
    }), sp("Sleep", 1, {
      notes: "5d8 hit points of creatures fall unconscious."
    }), sp("Misty Step", 2, {
      prepared: true,
      notes: "Bonus action: teleport 30 ft."
    }), sp("Scorching Ray", 2, {
      prepared: true,
      notes: "3 rays, 2d6 fire each."
    })];
    c.features = [{
      id: uid(),
      name: "Arcane Recovery",
      source: "Class",
      desc: "Once per day after a short rest, recover spell slots with combined level up to half your wizard level (rounded up).",
      max: 1,
      used: 0,
      recharge: "long"
    }, {
      id: uid(),
      name: "Ritual Adept",
      source: "Class",
      desc: "Cast Wizard spells with the Ritual tag from your spellbook without preparing them.",
      max: 0,
      used: 0,
      recharge: "none"
    }, {
      id: uid(),
      name: "Sculpt Spells",
      source: "Subclass",
      desc: "Protect allies from your evocation spells: they succeed on saves and take no damage on a success.",
      max: 0,
      used: 0,
      recharge: "none"
    }, {
      id: uid(),
      name: "Darkvision",
      source: "Species",
      desc: "See in dim light within 60 ft. as if bright, and in darkness as if dim.",
      max: 0,
      used: 0,
      recharge: "none"
    }, {
      id: uid(),
      name: "Fey Ancestry",
      source: "Species",
      desc: "Advantage on saves against being charmed; magic can't put you to sleep.",
      max: 0,
      used: 0,
      recharge: "none"
    }];
    c.items = [{
      id: uid(),
      name: "Quarterstaff",
      qty: 1,
      weight: 4,
      equipped: true,
      notes: ""
    }, {
      id: uid(),
      name: "Dagger",
      qty: 2,
      weight: 1,
      equipped: true,
      notes: ""
    }, {
      id: uid(),
      name: "Spellbook",
      qty: 1,
      weight: 3,
      equipped: false,
      notes: ""
    }, {
      id: uid(),
      name: "Component pouch",
      qty: 1,
      weight: 2,
      equipped: true,
      notes: ""
    }, {
      id: uid(),
      name: "Rations (day)",
      qty: 5,
      weight: 2,
      equipped: false,
      notes: ""
    }, {
      id: uid(),
      name: "Bedroll",
      qty: 1,
      weight: 7,
      equipped: false,
      notes: ""
    }];
    c.coins = {
      cp: 12,
      sp: 8,
      ep: 0,
      gp: 45,
      pp: 0
    };
    c.bio = {
      ...c.bio,
      traits: "I use polysyllabic words to convey the impression of great erudition.",
      ideals: "Knowledge. The path to power and self-improvement is through knowledge.",
      bonds: "I've been searching my whole life for the answer to a certain question.",
      flaws: "I overlook obvious solutions in favor of complicated ones.",
      armorProf: "None",
      weaponProf: "Daggers, darts, slings, quarterstaffs, light crossbows",
      toolProf: "",
      languages: "Common, Elvish, Draconic",
      notes: ""
    };
    return c;
  }

  // Derived numbers used all over the sheet.
  function derive(c) {
    const pb = profBonusFor(c.level);
    const mods = {};
    ABILITIES.forEach(([k]) => {
      mods[k] = abilityMod(c.abilities[k]);
    });
    const save = k => mods[k] + (c.saveProf[k] ? pb : 0);
    const skill = k => {
      const def = SKILLS.find(s => s[0] === k);
      return mods[def[2]] + (c.skillProf[k] === 2 ? pb * 2 : c.skillProf[k] === 1 ? pb : 0);
    };
    const sm = c.spellAbility ? mods[c.spellAbility] : 0;
    return {
      pb,
      mods,
      save,
      skill,
      init: mods.dex + num(c.initMisc),
      passive: 10 + skill("perception"),
      spellDC: 8 + pb + sm,
      spellAtk: pb + sm,
      hitDiceLeft: Math.max(0, num(c.level) - num(c.hitDiceUsed)),
      capacity: num(c.abilities.str) * 15,
      carried: sum(c.items.map(i => num(i.qty) * (parseFloat(i.weight) || 0)))
    };
  }
  const damageChar = (c, n) => {
    let left = Math.max(0, n);
    let temp = num(c.hp.temp);
    const absorbed = Math.min(temp, left);
    temp -= absorbed;
    left -= absorbed;
    return {
      ...c,
      hp: {
        ...c.hp,
        temp,
        cur: Math.max(0, num(c.hp.cur) - left)
      }
    };
  };
  const healChar = (c, n) => {
    const was = num(c.hp.cur);
    const cur = Math.min(num(c.hp.max), was + Math.max(0, n));
    return {
      ...c,
      hp: {
        ...c.hp,
        cur
      },
      deathSaves: was === 0 && cur > 0 ? {
        s: 0,
        f: 0
      } : c.deathSaves
    };
  };

  // Parses "2d6+3", "1d8-1", "d20" etc. Returns null if it can't be read.
  function rollExpression(expr) {
    const clean = String(expr || "").replace(/\s+/g, "").toLowerCase();
    const terms = clean.match(/[+-]?[^+-]+/g);
    if (!terms) return null;
    let total = 0;
    const bits = [];
    for (const t of terms) {
      const sign = t.startsWith("-") ? -1 : 1;
      const body = t.replace(/^[+-]/, "");
      const m = body.match(/^(\d*)d(\d+)$/);
      if (m) {
        const n = clamp(parseInt(m[1] || "1", 10), 1, 100);
        const s = parseInt(m[2], 10);
        if (s < 1) return null;
        const rolls = Array.from({
          length: n
        }, () => rnd(s));
        total += sign * sum(rolls);
        bits.push(`${sign < 0 ? "−" : ""}${n}d${s} [${rolls.join(", ")}]`);
      } else if (/^\d+$/.test(body)) {
        total += sign * parseInt(body, 10);
        bits.push(`${sign < 0 ? "−" : "+"} ${body}`);
      } else return null;
    }
    return {
      total,
      detail: bits.join(" ")
    };
  }

  // ───────────────────────── storage ─────────────────────────
  const STORE_KEY = "initSheet.v1";
  function loadStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY));
      if (raw && raw.chars && raw.order && raw.order.length) return raw;
    } catch (e) {/* ignore */}
    const s = newChar("New Character");
    return {
      chars: {
        [s.id]: s
      },
      order: [s.id],
      activeId: s.id,
      settings: {
        ruleset: "2024"
      }
    };
  }

  // ───────────────────────── icons ─────────────────────────
  const svgBase = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const mkIcon = d => ({
    className
  }) => /*#__PURE__*/React.createElement("svg", {
    ...svgBase,
    className: className,
    "aria-hidden": "true"
  }, d.split("|").map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })));
  const IconHeart = mkIcon("M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z");
  const IconShield = mkIcon("M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z");
  const IconBolt = mkIcon("M13 2L4 14h7l-1 8 9-12h-7z");
  const IconBoots = mkIcon("M4 4h6v9l7 2c2 .5 3 1.5 3 3v2H4z|M4 17h16");
  const IconStar = mkIcon("M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z");
  const IconEye = mkIcon("M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z");
  const IconD20 = mkIcon("M12 2l9 5v10l-9 5-9-5V7z|M12 8l4 7H8z|M12 2v6M3 7l5 8M21 7l-5 8M8 15l4 7M16 15l-4 7");
  const IconSword = mkIcon("M5 19L19 5M14 5h5v5|M7 15l2 2|M3 21l3-3");
  const IconBook = mkIcon("M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5|M9 7h6");
  const IconSparkles = mkIcon("M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z|M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z");
  const IconBag = mkIcon("M6 8h12l1 13H5z|M9 8V6a3 3 0 0 1 6 0v2");
  const IconScroll = mkIcon("M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z|M8 9h8M8 13h8");
  const IconCrown = mkIcon("M3 8l4 4 5-7 5 7 4-4v11H3z");
  const IconUser = mkIcon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M4 21c0-4 3.5-6 8-6s8 2 8 6");
  const IconMoon = mkIcon("M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z");
  const IconFlame = mkIcon("M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z");
  const IconPencil = mkIcon("M4 20l4-1 11-11-3-3L5 16z|M14 6l3 3");
  const IconPlus = mkIcon("M12 5v14M5 12h14");
  const IconMinus = mkIcon("M5 12h14");
  const IconX = mkIcon("M6 6l12 12M18 6L6 18");
  const IconCheck = mkIcon("M5 12l5 5 9-10");
  const IconChevD = mkIcon("M6 9l6 6 6-6");
  const IconChevU = mkIcon("M6 15l6-6 6 6");
  const IconSkull = mkIcon("M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14z|M9 12h.01M15 12h.01|M10 20v-2M14 20v-2");
  const IconTrash = mkIcon("M4 7h16M9 7V4h6v3|M6 7l1 14h10l1-14");
  const IconCopy = mkIcon("M9 9h11v11H9z|M5 15V4h11");
  const IconDownload = mkIcon("M12 4v12M7 11l5 5 5-5M4 20h16");
  const IconUpload = mkIcon("M12 16V4M7 9l5-5 5 5M4 20h16");
  const IconMenu = mkIcon("M4 7h16M4 12h16M4 17h16");
  const IconCamera = mkIcon("M4 8h3l2-3h6l2 3h3v12H4z|M12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z");
  const IconArrowUp = mkIcon("M12 19V5M6 11l6-6 6 6");
  const IconArrowDown = mkIcon("M12 5v14M6 13l6 6 6-6");
  // ───────────────────────── shared UI ─────────────────────────
  const Ctx = createContext(null);
  const inputCls = "bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-sm text-neutral-100 outline-none focus:border-amber-500 placeholder:text-neutral-600 min-w-0";
  function Card({
    title,
    icon,
    right,
    children,
    className = ""
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: `rounded-2xl border border-amber-900/40 bg-neutral-900 gilded p-3 ${className}`
    }, (title || right) && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-2"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300"
    }, icon, title), right), children);
  }
  function NumIn({
    value,
    onChange,
    min = 0,
    max = 999,
    className = ""
  }) {
    return /*#__PURE__*/React.createElement("input", {
      type: "number",
      inputMode: "numeric",
      value: value === "" || value === undefined ? "" : value,
      onChange: e => onChange(e.target.value === "" ? "" : clamp(parseInt(e.target.value, 10) || 0, min, max)),
      className: `text-center ${inputCls} ${className}`
    });
  }
  function TextIn({
    value,
    onChange,
    placeholder,
    className = ""
  }) {
    return /*#__PURE__*/React.createElement("input", {
      value: value || "",
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      className: `${inputCls} ${className}`
    });
  }
  function TextArea({
    value,
    onChange,
    placeholder,
    rows = 3
  }) {
    return /*#__PURE__*/React.createElement("textarea", {
      value: value || "",
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      rows: rows,
      className: `w-full resize-y ${inputCls}`
    });
  }
  function Stepper({
    value,
    onChange,
    min = 0,
    max = 99,
    step = 1,
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-center gap-1",
      role: "group",
      "aria-label": label
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onChange(clamp(num(value) - step, min, max)),
      "aria-label": `${label || "value"} down`,
      className: "w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
    }, /*#__PURE__*/React.createElement(IconMinus, {
      className: "w-3.5 h-3.5"
    })), /*#__PURE__*/React.createElement("span", {
      className: "min-w-[1.75rem] text-center text-sm font-semibold tabular-nums"
    }, num(value)), /*#__PURE__*/React.createElement("button", {
      onClick: () => onChange(clamp(num(value) + step, min, max)),
      "aria-label": `${label || "value"} up`,
      className: "w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
    }, /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-3.5 h-3.5"
    })));
  }
  const PIP_COLORS = {
    amber: "bg-amber-400 border-amber-300",
    sky: "bg-sky-400 border-sky-300",
    violet: "bg-violet-400 border-violet-300",
    emerald: "bg-emerald-400 border-emerald-300",
    rose: "bg-rose-400 border-rose-300"
  };
  // `total` pips; the first `total-used` are filled. Tap a filled pip to spend one, an empty pip to restore one.
  function Pips({
    total,
    used,
    onChange,
    color = "amber",
    label
  }) {
    const avail = Math.max(0, total - used);
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5",
      role: "group",
      "aria-label": label
    }, Array.from({
      length: total
    }, (_, i) => {
      const filled = i < avail;
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => onChange(filled ? used + 1 : Math.max(0, used - 1)),
        "aria-label": `${label || "pip"} ${filled ? "available" : "spent"}`,
        className: `w-5 h-5 rounded-full border-2 transition-colors ${filled ? PIP_COLORS[color] : "bg-transparent border-neutral-600"}`
      });
    }));
  }
  function Modal({
    title,
    onClose,
    children,
    wide
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 p-3",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-full ${wide ? "max-w-md" : "max-w-sm"} max-h-[88vh] overflow-y-auto rounded-2xl border border-amber-900/50 bg-neutral-900 p-4 shadow-2xl`,
      onClick: e => e.stopPropagation(),
      role: "dialog",
      "aria-label": title
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-serif text-sm font-bold uppercase tracking-[0.14em] text-amber-300"
    }, title), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      "aria-label": "Close",
      className: "text-neutral-500 hover:text-neutral-200"
    }, /*#__PURE__*/React.createElement(IconX, {
      className: "w-5 h-5"
    }))), children));
  }
  const btnCls = "rounded-lg text-sm font-semibold py-2 px-3 transition-colors";
  const btnPrimary = `${btnCls} bg-amber-500 hover:bg-amber-400 text-neutral-950`;
  const btnGhost = `${btnCls} bg-neutral-800 hover:bg-neutral-700 text-neutral-200`;
  const btnDanger = `${btnCls} bg-rose-700 hover:bg-rose-600 text-white`;

  // Generic edit helpers for list-valued fields (attacks, spells, features, items).
  const listOps = (set, field) => ({
    upd: (id, patch) => set(x => ({
      ...x,
      [field]: x[field].map(i => i.id === id ? {
        ...i,
        ...patch
      } : i)
    })),
    del: id => set(x => ({
      ...x,
      [field]: x[field].filter(i => i.id !== id)
    })),
    add: item => set(x => ({
      ...x,
      [field]: [...x[field], {
        id: uid(),
        ...item
      }]
    })),
    move: (id, dir) => set(x => {
      const arr = [...x[field]];
      const i = arr.findIndex(v => v.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return x;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return {
        ...x,
        [field]: arr
      };
    })
  });
  function ProfDot({
    level
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: `inline-flex shrink-0 items-center justify-center w-4 h-4 rounded-full border ${level ? "border-amber-400" : "border-neutral-600"}`
    }, level >= 1 && /*#__PURE__*/React.createElement("span", {
      className: `block rounded-full bg-amber-400 ${level === 2 ? "w-2 h-2 ring-2 ring-neutral-900 outline outline-1 outline-amber-400" : "w-2.5 h-2.5"}`
    }));
  }

  // ───────────────────────── STATS ─────────────────────────
  function StatTile({
    icon,
    label,
    children,
    onClick,
    accent = "text-amber-300",
    disabled
  }) {
    const Tag = onClick ? "button" : "div";
    return /*#__PURE__*/React.createElement(Tag, {
      onClick: onClick,
      disabled: onClick ? disabled : undefined,
      className: `flex flex-col items-center justify-center gap-0.5 rounded-xl border border-neutral-700/80 bg-neutral-950/60 px-1 py-2 min-h-[4.5rem] ${onClick ? "hover:border-amber-600 active:bg-neutral-800" : ""}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `${accent}`
    }, icon), /*#__PURE__*/React.createElement("span", {
      className: "text-lg font-bold leading-none tabular-nums"
    }, children), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase tracking-wider text-neutral-500"
    }, label));
  }

  // Shown in a dropdown from the header: demographics in play mode, full identity editor in edit mode.
  function DemographicsPanel({
    c,
    set
  }) {
    const {
      edit,
      labels,
      pickPortrait
    } = useContext(Ctx);
    const up = patch => set(x => ({
      ...x,
      ...patch
    }));
    if (!edit) {
      const rows = [[labels.species, c.species], ["Background", c.background], ["Alignment", c.alignment], ...(labels.showXp ? [["Experience", c.xp]] : [])].filter(([, v]) => v !== "" && v !== undefined);
      return rows.length === 0 ? /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-neutral-400"
      }, "Nothing filled in yet. Turn on edit mode (pencil) to add your ", labels.species.toLowerCase(), ", background and alignment.") : /*#__PURE__*/React.createElement("dl", {
        className: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm"
      }, rows.map(([k, v]) => /*#__PURE__*/React.createElement(React.Fragment, {
        key: k
      }, /*#__PURE__*/React.createElement("dt", {
        className: "text-xs uppercase tracking-wider text-neutral-500 self-center"
      }, k), /*#__PURE__*/React.createElement("dd", {
        className: "text-neutral-100"
      }, v))));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: c.name,
      onChange: v => up({
        name: v
      }),
      placeholder: "Character name",
      className: "col-span-2"
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: c.cls,
      onChange: v => up({
        cls: v
      }),
      placeholder: "Class"
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: c.subclass,
      onChange: v => up({
        subclass: v
      }),
      placeholder: "Subclass"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500 shrink-0"
    }, "Level"), /*#__PURE__*/React.createElement(NumIn, {
      value: c.level,
      onChange: v => up({
        level: v
      }),
      min: 1,
      max: 20,
      className: "w-full"
    })), /*#__PURE__*/React.createElement(TextIn, {
      value: c.species,
      onChange: v => up({
        species: v
      }),
      placeholder: labels.species
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: c.background,
      onChange: v => up({
        background: v
      }),
      placeholder: "Background"
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: c.alignment,
      onChange: v => up({
        alignment: v
      }),
      placeholder: "Alignment"
    }), labels.showXp && /*#__PURE__*/React.createElement(TextIn, {
      value: c.xp,
      onChange: v => up({
        xp: v
      }),
      placeholder: "Experience points",
      className: "col-span-2"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500 shrink-0"
    }, "Max HP"), /*#__PURE__*/React.createElement(NumIn, {
      value: c.hp.max,
      onChange: v => set(x => ({
        ...x,
        hp: {
          ...x.hp,
          max: v,
          cur: Math.min(num(x.hp.cur), num(v))
        }
      })),
      className: "w-full"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500 shrink-0"
    }, "Hit die d"), /*#__PURE__*/React.createElement(NumIn, {
      value: c.hitDie,
      onChange: v => up({
        hitDie: v
      }),
      min: 4,
      max: 12,
      className: "w-full"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: pickPortrait,
      className: "col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold py-2 text-neutral-200"
    }, /*#__PURE__*/React.createElement(IconCamera, {
      className: "w-4 h-4"
    }), c.portrait ? "Change portrait" : "Add portrait"));
  }

  // Thin field under the HP bar in the header. Tap opens the conditions editor.
  function ConditionsBar({
    c
  }) {
    const {
      openModal
    } = useContext(Ctx);
    const chips = [];
    if (c.concentrating) chips.push(["conc", c.concentrating !== "Concentrating" ? `Conc: ${c.concentrating}` : "Concentrating", "border-yellow-600 bg-yellow-900/30 text-yellow-200"]);
    c.conditions.forEach(n => chips.push([n, n, "border-violet-600 bg-violet-900/30 text-violet-200"]));
    if (num(c.exhaustion) > 0) chips.push(["exh", `Exhaustion ${c.exhaustion}`, "border-rose-600 bg-rose-900/30 text-rose-200"]);
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => openModal("conditions"),
      "aria-label": "Conditions",
      className: "mt-1.5 w-full h-6 flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/70 px-1.5 text-left overflow-hidden"
    }, /*#__PURE__*/React.createElement(IconSkull, {
      className: "w-3 h-3 shrink-0 text-neutral-500"
    }), chips.length === 0 ? /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-neutral-600"
    }, "No conditions") : /*#__PURE__*/React.createElement("span", {
      className: "flex-1 min-w-0 flex items-center gap-1 overflow-hidden"
    }, chips.map(([k, t, cls]) => /*#__PURE__*/React.createElement("span", {
      key: k,
      className: `shrink-0 rounded-full border px-1.5 text-[10px] leading-4 ${cls}`
    }, t))), /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-3 h-3 shrink-0 text-neutral-600 ml-auto"
    }));
  }
  function AttacksCard({
    c,
    set
  }) {
    const {
      edit,
      rollD20,
      rollDamage
    } = useContext(Ctx);
    const ops = listOps(set, "attacks");
    return /*#__PURE__*/React.createElement(Card, {
      title: "Attacks",
      icon: /*#__PURE__*/React.createElement(IconSword, {
        className: "w-3.5 h-3.5"
      }),
      right: edit ? /*#__PURE__*/React.createElement("button", {
        onClick: () => ops.add({
          name: "New attack",
          bonus: "0",
          damage: "1d6",
          type: "",
          notes: ""
        }),
        className: "text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1"
      }, /*#__PURE__*/React.createElement(IconPlus, {
        className: "w-3.5 h-3.5"
      }), "Add") : null
    }, c.attacks.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "No attacks yet. Turn on edit mode (pencil) to add one."), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, c.attacks.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "rounded-xl border border-neutral-700/80 bg-neutral-950/60 p-2"
    }, edit ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5 items-center"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: a.name,
      onChange: v => ops.upd(a.id, {
        name: v
      }),
      placeholder: "Name",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.move(a.id, -1),
      disabled: i === 0,
      "aria-label": "Move attack up",
      className: "text-neutral-500 disabled:opacity-20"
    }, /*#__PURE__*/React.createElement(IconChevU, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.move(a.id, 1),
      disabled: i === c.attacks.length - 1,
      "aria-label": "Move attack down",
      className: "text-neutral-500 disabled:opacity-20"
    }, /*#__PURE__*/React.createElement(IconChevD, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.del(a.id),
      "aria-label": "Delete attack",
      className: "text-neutral-600 hover:text-rose-300"
    }, /*#__PURE__*/React.createElement(IconTrash, {
      className: "w-4 h-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: a.bonus,
      onChange: v => ops.upd(a.id, {
        bonus: v
      }),
      placeholder: "Atk +"
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: a.damage,
      onChange: v => ops.upd(a.id, {
        damage: v
      }),
      placeholder: "1d8+3"
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: a.type,
      onChange: v => ops.upd(a.id, {
        type: v
      }),
      placeholder: "Type"
    })), /*#__PURE__*/React.createElement(TextIn, {
      value: a.notes,
      onChange: v => ops.upd(a.id, {
        notes: v
      }),
      placeholder: "Notes (range, properties)",
      className: "w-full"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-semibold text-sm truncate"
    }, a.name), a.notes && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500 truncate"
    }, a.notes)), /*#__PURE__*/React.createElement("button", {
      onClick: () => rollD20(`${a.name} attack`, num(a.bonus)),
      "aria-label": `Roll ${a.name} attack`,
      className: "rounded-lg border border-amber-700 bg-amber-900/20 px-2.5 py-1.5 text-sm font-bold text-amber-200 tabular-nums hover:bg-amber-900/40"
    }, fmt(num(a.bonus))), /*#__PURE__*/React.createElement("button", {
      onClick: () => rollDamage(`${a.name} damage${a.type ? ` (${a.type})` : ""}`, a.damage),
      "aria-label": `Roll ${a.name} damage`,
      className: "rounded-lg border border-rose-800 bg-rose-900/20 px-2.5 py-1.5 text-sm font-bold text-rose-200 hover:bg-rose-900/40"
    }, a.damage || "—", a.type && /*#__PURE__*/React.createElement("span", {
      className: "block text-[9px] font-normal uppercase text-rose-300/70 leading-none"
    }, a.type)))))));
  }
  function SkillsCard({
    c,
    set
  }) {
    const {
      edit,
      rollD20
    } = useContext(Ctx);
    const [userOpen, setUserOpen] = useState(false);
    const open = userOpen || edit;
    const d = derive(c);
    const cycleSkill = k => set(x => ({
      ...x,
      skillProf: {
        ...x.skillProf,
        [k]: (x.skillProf[k] + 1) % 3
      }
    }));
    const profCount = SKILLS.filter(([k]) => c.skillProf[k] > 0).length;
    return /*#__PURE__*/React.createElement(Card, {
      title: "Skills",
      icon: /*#__PURE__*/React.createElement(IconBook, {
        className: "w-3.5 h-3.5"
      }),
      right: edit ? /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] text-neutral-500"
      }, "tap: none → proficient → expertise") : /*#__PURE__*/React.createElement("button", {
        onClick: () => setUserOpen(v => !v),
        "aria-expanded": open,
        "aria-label": "Toggle skills",
        className: "flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200"
      }, profCount, " proficient", open ? /*#__PURE__*/React.createElement(IconChevU, {
        className: "w-4 h-4"
      }) : /*#__PURE__*/React.createElement(IconChevD, {
        className: "w-4 h-4"
      }))
    }, open ? /*#__PURE__*/React.createElement("div", {
      className: "divide-y divide-neutral-800/80"
    }, SKILLS.map(([k, name, ab]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: edit ? () => cycleSkill(k) : () => rollD20(`${name} check`, d.skill(k)),
      "aria-label": `${name} skill`,
      className: "w-full flex items-center gap-2 py-2 px-1 hover:bg-neutral-800/60 active:bg-neutral-800"
    }, /*#__PURE__*/React.createElement(ProfDot, {
      level: c.skillProf[k]
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 text-left text-sm"
    }, name), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-neutral-500"
    }, ab), /*#__PURE__*/React.createElement("span", {
      className: "w-9 text-right text-sm font-bold tabular-nums text-amber-200"
    }, fmt(d.skill(k)))))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setUserOpen(true),
      className: "w-full text-left text-xs text-neutral-500"
    }, "Tap to show all 18 skills."));
  }
  function StatsTab({
    c,
    set
  }) {
    const {
      edit,
      rollD20,
      labels,
      spendHitDie
    } = useContext(Ctx);
    const d = derive(c);
    const [ov, setOv] = useState(true);
    const up = patch => set(x => ({
      ...x,
      ...patch
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Overview",
      icon: /*#__PURE__*/React.createElement(IconShield, {
        className: "w-3.5 h-3.5"
      }),
      right: /*#__PURE__*/React.createElement("button", {
        onClick: () => setOv(v => !v),
        "aria-expanded": ov,
        "aria-label": "Toggle overview",
        className: "flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200"
      }, !ov && /*#__PURE__*/React.createElement("span", {
        className: "tabular-nums"
      }, "AC ", num(c.ac), " · Init ", fmt(d.init), " · ", c.speed || "—"), ov ? /*#__PURE__*/React.createElement(IconChevU, {
        className: "w-4 h-4"
      }) : /*#__PURE__*/React.createElement(IconChevD, {
        className: "w-4 h-4"
      }))
    }, ov && /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4 gap-2"
    }, /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconShield, {
        className: "w-5 h-5"
      }),
      label: "AC"
    }, edit ? /*#__PURE__*/React.createElement(NumIn, {
      value: c.ac,
      onChange: v => up({
        ac: v
      }),
      className: "w-12 !px-0.5"
    }) : num(c.ac)), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconBolt, {
        className: "w-5 h-5"
      }),
      label: "Initiative",
      onClick: edit ? undefined : () => rollD20("Initiative", d.init)
    }, edit ? /*#__PURE__*/React.createElement(NumIn, {
      value: c.initMisc,
      onChange: v => up({
        initMisc: v
      }),
      min: -20,
      max: 20,
      className: "w-12 !px-0.5"
    }) : fmt(d.init)), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconBoots, {
        className: "w-5 h-5"
      }),
      label: "Speed"
    }, edit ? /*#__PURE__*/React.createElement(TextIn, {
      value: c.speed,
      onChange: v => up({
        speed: v
      }),
      className: "w-14 !px-1 text-center"
    }) : /*#__PURE__*/React.createElement("span", {
      className: "text-base"
    }, c.speed || "—")), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconStar, {
        className: "w-5 h-5"
      }),
      label: "Prof."
    }, fmt(d.pb))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => up({
        inspiration: !c.inspiration
      }),
      "aria-pressed": c.inspiration,
      className: `flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 min-h-[4.5rem] ${c.inspiration ? "border-amber-400 bg-amber-500/15 text-amber-200" : "border-neutral-700/80 bg-neutral-950/60 text-neutral-500"}`
    }, /*#__PURE__*/React.createElement(IconSparkles, {
      className: "w-5 h-5"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-bold leading-none"
    }, c.inspiration ? "Ready" : "None"), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase tracking-wider text-center leading-tight"
    }, labels.inspiration)), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconEye, {
        className: "w-5 h-5"
      }),
      label: "Passive Perc."
    }, d.passive), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconD20, {
        className: "w-5 h-5"
      }),
      label: `Hit Dice d${num(c.hitDie)}`,
      onClick: spendHitDie,
      disabled: d.hitDiceLeft === 0
    }, d.hitDiceLeft, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500"
    }, "/", num(c.level)))))), /*#__PURE__*/React.createElement(Card, {
      title: "Ability Scores & Saves",
      icon: /*#__PURE__*/React.createElement(IconCrown, {
        className: "w-3.5 h-3.5"
      }),
      right: edit ? /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] text-neutral-500"
      }, "tap a save to toggle proficiency") : null
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, ABILITIES.map(([k, name]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      className: "rounded-xl border border-neutral-700/80 bg-neutral-950/60 p-1.5 text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] font-bold uppercase tracking-wider text-neutral-400"
    }, name), /*#__PURE__*/React.createElement("button", {
      disabled: edit,
      onClick: () => rollD20(`${name} check`, d.mods[k]),
      "aria-label": `Roll ${name} check`,
      className: `w-full my-0.5 rounded-lg py-1 text-2xl font-bold tabular-nums ${edit ? "text-neutral-300" : "text-amber-200 hover:bg-neutral-800 active:bg-neutral-700"}`
    }, fmt(d.mods[k])), edit ? /*#__PURE__*/React.createElement(NumIn, {
      value: c.abilities[k],
      onChange: v => set(x => ({
        ...x,
        abilities: {
          ...x.abilities,
          [k]: v
        }
      })),
      min: 1,
      max: 30,
      className: "w-full !py-0.5"
    }) : /*#__PURE__*/React.createElement("span", {
      className: "inline-block rounded-full border border-neutral-600 px-2 text-xs text-neutral-300 tabular-nums"
    }, num(c.abilities[k])), /*#__PURE__*/React.createElement("button", {
      onClick: edit ? () => set(x => ({
        ...x,
        saveProf: {
          ...x.saveProf,
          [k]: !x.saveProf[k]
        }
      })) : () => rollD20(`${name} save`, d.save(k)),
      "aria-label": `${name} saving throw`,
      className: "mt-1.5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 text-xs hover:border-amber-700 active:bg-neutral-800"
    }, /*#__PURE__*/React.createElement(ProfDot, {
      level: c.saveProf[k] ? 1 : 0
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-neutral-400"
    }, "Save"), /*#__PURE__*/React.createElement("span", {
      className: "font-bold tabular-nums text-amber-200"
    }, fmt(d.save(k)))))))), /*#__PURE__*/React.createElement(SkillsCard, {
      c: c,
      set: set
    }), /*#__PURE__*/React.createElement(FeaturesTab, {
      c: c,
      set: set
    }));
  }

  // ───────────────────────── ACTIONS ─────────────────────────
  function ActionsTab({
    c,
    set
  }) {
    const [showCommon, setShowCommon] = useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(AttacksCard, {
      c: c,
      set: set
    }), /*#__PURE__*/React.createElement(Card, {
      title: "Common Actions",
      icon: /*#__PURE__*/React.createElement(IconScroll, {
        className: "w-3.5 h-3.5"
      }),
      right: /*#__PURE__*/React.createElement("button", {
        onClick: () => setShowCommon(v => !v),
        "aria-label": "Toggle common actions",
        "aria-expanded": showCommon,
        className: "text-neutral-400"
      }, showCommon ? /*#__PURE__*/React.createElement(IconChevU, {
        className: "w-4 h-4"
      }) : /*#__PURE__*/React.createElement(IconChevD, {
        className: "w-4 h-4"
      }))
    }, showCommon ? /*#__PURE__*/React.createElement("dl", {
      className: "space-y-1.5"
    }, COMMON_ACTIONS.map(([n, t]) => /*#__PURE__*/React.createElement("div", {
      key: n
    }, /*#__PURE__*/React.createElement("dt", {
      className: "inline text-sm font-semibold text-amber-200"
    }, n, ". "), /*#__PURE__*/React.createElement("dd", {
      className: "inline text-xs text-neutral-400"
    }, t)))) : /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use an Object…")));
  }

  // ───────────────────────── SPELLS ─────────────────────────
  function SpellCard({
    s,
    c,
    set,
    open,
    onToggle,
    edit
  }) {
    const {
      toast
    } = useContext(Ctx);
    const ops = listOps(set, "spells");
    const availableLevels = [];
    for (let l = Math.max(1, s.level); l <= 9; l++) if (num(c.slots[l].max) - num(c.slots[l].used) > 0) availableLevels.push(l);
    const [castLevel, setCastLevel] = useState(0);
    const lvl = availableLevels.includes(castLevel) ? castLevel : availableLevels[0];
    const concentrate = x => s.conc ? {
      ...x,
      concentrating: s.name
    } : x;
    const cast = () => {
      if (s.level === 0) {
        set(x => concentrate(x));
        toast(`Cast ${s.name}`);
        return;
      }
      if (!lvl) {
        toast("No spell slots left for that level");
        return;
      }
      set(x => concentrate({
        ...x,
        slots: {
          ...x.slots,
          [lvl]: {
            ...x.slots[lvl],
            used: num(x.slots[lvl].used) + 1
          }
        }
      }));
      toast(`Cast ${s.name} (level ${lvl})`);
    };
    const ritual = () => {
      set(x => concentrate(x));
      toast(`Ritual cast ${s.name}`);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-neutral-700/80 bg-neutral-950/60"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onToggle,
      "aria-expanded": open,
      className: "w-full flex items-center gap-2 px-2.5 py-2 text-left"
    }, /*#__PURE__*/React.createElement("span", {
      className: `w-2 h-2 rounded-full shrink-0 ${s.prepared ? "bg-amber-400" : "bg-neutral-700"}`,
      title: s.prepared ? "Prepared" : "Not prepared"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 text-sm font-semibold truncate"
    }, s.name), s.conc && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] rounded border border-yellow-700 text-yellow-300 px-1"
    }, "C"), s.ritual && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] rounded border border-sky-700 text-sky-300 px-1"
    }, "R"), open ? /*#__PURE__*/React.createElement(IconChevU, {
      className: "w-4 h-4 text-neutral-500"
    }) : /*#__PURE__*/React.createElement(IconChevD, {
      className: "w-4 h-4 text-neutral-500"
    })), open && /*#__PURE__*/React.createElement("div", {
      className: "px-2.5 pb-2.5 space-y-2"
    }, edit ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: s.name,
      onChange: v => ops.upd(s.id, {
        name: v
      }),
      placeholder: "Spell name",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("select", {
      value: s.level,
      onChange: e => ops.upd(s.id, {
        level: parseInt(e.target.value, 10)
      }),
      "aria-label": "Spell level",
      className: `${inputCls} w-24`
    }, /*#__PURE__*/React.createElement("option", {
      value: 0
    }, "Cantrip"), [1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => /*#__PURE__*/React.createElement("option", {
      key: l,
      value: l
    }, "Level ", l)))), /*#__PURE__*/React.createElement(TextArea, {
      value: s.notes,
      onChange: v => ops.upd(s.id, {
        notes: v
      }),
      placeholder: "Range, components, damage, effect…",
      rows: 3
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 text-xs text-neutral-300"
    }, /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: s.conc,
      onChange: e => ops.upd(s.id, {
        conc: e.target.checked
      })
    }), "Concentration"), /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: s.ritual,
      onChange: e => ops.upd(s.id, {
        ritual: e.target.checked
      })
    }), "Ritual"), /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.del(s.id),
      "aria-label": "Delete spell",
      className: "ml-auto text-neutral-600 hover:text-rose-300"
    }, /*#__PURE__*/React.createElement(IconTrash, {
      className: "w-4 h-4"
    })))) : s.notes ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-400 whitespace-pre-wrap"
    }, s.notes) : /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-600"
    }, "No notes. Switch to edit mode to add some."), s.level > 0 && /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2 text-xs text-neutral-300"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: s.prepared,
      onChange: e => ops.upd(s.id, {
        prepared: e.target.checked
      })
    }), "Prepared"), !edit && s.level > 0 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, availableLevels.length > 0 && /*#__PURE__*/React.createElement("select", {
      value: lvl,
      onChange: e => setCastLevel(parseInt(e.target.value, 10)),
      "aria-label": "Cast at level",
      className: `${inputCls} w-28`
    }, availableLevels.map(l => /*#__PURE__*/React.createElement("option", {
      key: l,
      value: l
    }, l === s.level ? `Level ${l}` : `Upcast ${l}`))), /*#__PURE__*/React.createElement("button", {
      onClick: cast,
      className: `${btnPrimary} flex-1`
    }, lvl ? "Cast" : "No slots"), s.ritual && /*#__PURE__*/React.createElement("button", {
      onClick: ritual,
      className: btnGhost
    }, "Ritual"))));
  }
  function SpellsTab({
    c,
    set
  }) {
    const {
      edit
    } = useContext(Ctx);
    const d = derive(c);
    const ops = listOps(set, "spells");
    const [openId, setOpenId] = useState(null);
    const [draft, setDraft] = useState({
      name: "",
      level: 1
    });
    const up = patch => set(x => ({
      ...x,
      ...patch
    }));
    const setSlot = (l, patch) => set(x => ({
      ...x,
      slots: {
        ...x.slots,
        [l]: {
          ...x.slots[l],
          ...patch
        }
      }
    }));
    const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const preparedCount = c.spells.filter(s => s.level > 0 && s.prepared).length;
    const addSpell = () => {
      if (!draft.name.trim()) return;
      const id = uid();
      set(x => ({
        ...x,
        spells: [...x.spells, {
          id,
          name: draft.name.trim(),
          level: draft.level,
          prepared: draft.level === 0,
          conc: false,
          ritual: false,
          notes: ""
        }]
      }));
      setOpenId(id);
      setDraft({
        name: "",
        level: draft.level
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Spellcasting",
      icon: /*#__PURE__*/React.createElement(IconSparkles, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconBook, {
        className: "w-5 h-5"
      }),
      label: "Ability"
    }, edit ? /*#__PURE__*/React.createElement("select", {
      value: c.spellAbility,
      onChange: e => up({
        spellAbility: e.target.value
      }),
      "aria-label": "Spellcasting ability",
      className: `${inputCls} w-16 !px-1 text-sm`
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "None"), ABILITIES.map(([k,, ab]) => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, ab))) : /*#__PURE__*/React.createElement("span", {
      className: "text-base"
    }, c.spellAbility ? c.spellAbility.toUpperCase() : "—")), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconShield, {
        className: "w-5 h-5"
      }),
      label: "Spell Save DC"
    }, c.spellAbility ? d.spellDC : "—"), /*#__PURE__*/React.createElement(StatTile, {
      icon: /*#__PURE__*/React.createElement(IconSword, {
        className: "w-5 h-5"
      }),
      label: "Spell Attack"
    }, c.spellAbility ? fmt(d.spellAtk) : "—"))), /*#__PURE__*/React.createElement(Card, {
      title: "Spell Slots",
      icon: /*#__PURE__*/React.createElement(IconFlame, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, levels.slice(1).filter(l => edit || num(c.slots[l].max) > 0).map(l => /*#__PURE__*/React.createElement("div", {
      key: l,
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-14 text-xs font-semibold text-neutral-400"
    }, "Level ", l), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, num(c.slots[l].max) > 0 ? /*#__PURE__*/React.createElement(Pips, {
      total: num(c.slots[l].max),
      used: num(c.slots[l].used),
      onChange: u => setSlot(l, {
        used: u
      }),
      color: "sky",
      label: `Level ${l} slot`
    }) : /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-600"
    }, "No slots")), edit ? /*#__PURE__*/React.createElement(Stepper, {
      value: c.slots[l].max,
      onChange: v => setSlot(l, {
        max: v,
        used: Math.min(num(c.slots[l].used), v)
      }),
      max: 9,
      label: `Level ${l} max slots`
    }) : /*#__PURE__*/React.createElement("span", {
      className: "text-xs tabular-nums text-neutral-500"
    }, num(c.slots[l].max) - num(c.slots[l].used), "/", num(c.slots[l].max)))), !edit && levels.slice(1).every(l => num(c.slots[l].max) === 0) && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "No spell slots. Use edit mode to set them up."))), /*#__PURE__*/React.createElement(Card, {
      title: `Spells${preparedCount ? ` · ${preparedCount} prepared` : ""}`,
      icon: /*#__PURE__*/React.createElement(IconBook, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, levels.map(l => {
      const list = c.spells.filter(s => s.level === l);
      if (list.length === 0) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: l
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1"
      }, l === 0 ? "Cantrips" : `Level ${l}`), /*#__PURE__*/React.createElement("div", {
        className: "space-y-1.5"
      }, list.map(s => /*#__PURE__*/React.createElement(SpellCard, {
        key: s.id,
        s: s,
        c: c,
        set: set,
        edit: edit,
        open: openId === s.id,
        onToggle: () => setOpenId(openId === s.id ? null : s.id)
      }))));
    }), c.spells.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "No spells yet.")), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: draft.name,
      onChange: v => setDraft({
        ...draft,
        name: v
      }),
      placeholder: "Add a spell…",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("select", {
      value: draft.level,
      onChange: e => setDraft({
        ...draft,
        level: parseInt(e.target.value, 10)
      }),
      "aria-label": "New spell level",
      className: `${inputCls} w-24`
    }, /*#__PURE__*/React.createElement("option", {
      value: 0
    }, "Cantrip"), [1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => /*#__PURE__*/React.createElement("option", {
      key: l,
      value: l
    }, "Level ", l))), /*#__PURE__*/React.createElement("button", {
      onClick: addSpell,
      "aria-label": "Add spell",
      className: `${btnPrimary} !px-3`
    }, /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-4 h-4"
    })))));
  }

  // ───────────────────────── FEATURES ─────────────────────────
  const SOURCE_STYLE = {
    Class: "border-amber-700 text-amber-300",
    Subclass: "border-orange-700 text-orange-300",
    Species: "border-emerald-700 text-emerald-300",
    Background: "border-sky-700 text-sky-300",
    Feat: "border-violet-700 text-violet-300",
    Item: "border-pink-700 text-pink-300",
    Other: "border-neutral-600 text-neutral-300"
  };
  function FeaturesTab({
    c,
    set
  }) {
    const {
      edit
    } = useContext(Ctx);
    const ops = listOps(set, "features");
    const [openId, setOpenId] = useState(null);
    const [draft, setDraft] = useState({
      name: "",
      source: "Class"
    });
    const add = () => {
      if (!draft.name.trim()) return;
      const id = uid();
      set(x => ({
        ...x,
        features: [...x.features, {
          id,
          name: draft.name.trim(),
          source: draft.source,
          desc: "",
          max: 0,
          used: 0,
          recharge: "none"
        }]
      }));
      setOpenId(id);
      setDraft({
        ...draft,
        name: ""
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Features & Traits",
      icon: /*#__PURE__*/React.createElement(IconCrown, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, c.features.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "No features yet. Add class features, species traits and feats below."), c.features.map((f, i) => {
      const open = openId === f.id;
      return /*#__PURE__*/React.createElement("div", {
        key: f.id,
        className: "rounded-xl border border-neutral-700/80 bg-neutral-950/60"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 px-2.5 py-2"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setOpenId(open ? null : f.id),
        "aria-expanded": open,
        className: "flex-1 min-w-0 flex items-center gap-2 text-left"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-sm font-semibold truncate"
      }, f.name), /*#__PURE__*/React.createElement("span", {
        className: `text-[10px] rounded border px-1 shrink-0 ${SOURCE_STYLE[f.source] || SOURCE_STYLE.Other}`
      }, f.source)), num(f.max) > 0 && /*#__PURE__*/React.createElement(Pips, {
        total: num(f.max),
        used: num(f.used),
        onChange: u => ops.upd(f.id, {
          used: u
        }),
        color: "amber",
        label: `${f.name} use`
      }), /*#__PURE__*/React.createElement("button", {
        onClick: () => setOpenId(open ? null : f.id),
        "aria-label": open ? "Collapse" : "Expand"
      }, open ? /*#__PURE__*/React.createElement(IconChevU, {
        className: "w-4 h-4 text-neutral-500"
      }) : /*#__PURE__*/React.createElement(IconChevD, {
        className: "w-4 h-4 text-neutral-500"
      }))), open && /*#__PURE__*/React.createElement("div", {
        className: "px-2.5 pb-2.5 space-y-1.5"
      }, edit ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "flex gap-1.5"
      }, /*#__PURE__*/React.createElement(TextIn, {
        value: f.name,
        onChange: v => ops.upd(f.id, {
          name: v
        }),
        placeholder: "Name",
        className: "flex-1"
      }), /*#__PURE__*/React.createElement("select", {
        value: f.source,
        onChange: e => ops.upd(f.id, {
          source: e.target.value
        }),
        "aria-label": "Feature source",
        className: `${inputCls} w-28`
      }, FEATURE_SOURCES.map(s => /*#__PURE__*/React.createElement("option", {
        key: s
      }, s)))), /*#__PURE__*/React.createElement(TextArea, {
        value: f.desc,
        onChange: v => ops.upd(f.id, {
          desc: v
        }),
        placeholder: "Description",
        rows: 4
      }), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 text-xs text-neutral-400"
      }, /*#__PURE__*/React.createElement("span", null, "Uses"), /*#__PURE__*/React.createElement(Stepper, {
        value: f.max,
        onChange: v => ops.upd(f.id, {
          max: v,
          used: Math.min(num(f.used), v)
        }),
        max: 20,
        label: "Max uses"
      }), /*#__PURE__*/React.createElement("select", {
        value: f.recharge,
        onChange: e => ops.upd(f.id, {
          recharge: e.target.value
        }),
        "aria-label": "Recharge",
        className: `${inputCls} flex-1`
      }, /*#__PURE__*/React.createElement("option", {
        value: "none"
      }, "No recharge"), /*#__PURE__*/React.createElement("option", {
        value: "short"
      }, "Short rest"), /*#__PURE__*/React.createElement("option", {
        value: "long"
      }, "Long rest"))), /*#__PURE__*/React.createElement("div", {
        className: "flex justify-end gap-2"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => ops.move(f.id, -1),
        disabled: i === 0,
        "aria-label": "Move feature up",
        className: "text-neutral-500 disabled:opacity-20"
      }, /*#__PURE__*/React.createElement(IconChevU, {
        className: "w-4 h-4"
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => ops.move(f.id, 1),
        disabled: i === c.features.length - 1,
        "aria-label": "Move feature down",
        className: "text-neutral-500 disabled:opacity-20"
      }, /*#__PURE__*/React.createElement(IconChevD, {
        className: "w-4 h-4"
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => ops.del(f.id),
        "aria-label": "Delete feature",
        className: "text-neutral-600 hover:text-rose-300"
      }, /*#__PURE__*/React.createElement(IconTrash, {
        className: "w-4 h-4"
      })))) : /*#__PURE__*/React.createElement(React.Fragment, null, f.desc ? /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-neutral-400 whitespace-pre-wrap"
      }, f.desc) : /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-neutral-600"
      }, "No description."), num(f.max) > 0 && /*#__PURE__*/React.createElement("p", {
        className: "text-[11px] text-neutral-500"
      }, num(f.max) - num(f.used), "/", num(f.max), " uses", f.recharge !== "none" ? ` · recharges on ${f.recharge} rest` : ""))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: draft.name,
      onChange: v => setDraft({
        ...draft,
        name: v
      }),
      placeholder: "Add a feature…",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("select", {
      value: draft.source,
      onChange: e => setDraft({
        ...draft,
        source: e.target.value
      }),
      "aria-label": "New feature source",
      className: `${inputCls} w-24`
    }, FEATURE_SOURCES.map(s => /*#__PURE__*/React.createElement("option", {
      key: s
    }, s))), /*#__PURE__*/React.createElement("button", {
      onClick: add,
      "aria-label": "Add feature",
      className: `${btnPrimary} !px-3`
    }, /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-4 h-4"
    })))));
  }

  // ───────────────────────── GEAR ─────────────────────────
  function GearTab({
    c,
    set
  }) {
    const {
      edit
    } = useContext(Ctx);
    const d = derive(c);
    const ops = listOps(set, "items");
    const [draft, setDraft] = useState("");
    const pct = d.capacity ? clamp(d.carried / d.capacity * 100, 0, 100) : 0;
    const over = d.capacity && d.carried > d.capacity;
    const add = () => {
      if (!draft.trim()) return;
      ops.add({
        name: draft.trim(),
        qty: 1,
        weight: 0,
        equipped: false,
        notes: ""
      });
      setDraft("");
    };
    const coinTotalGp = num(c.coins.cp) / 100 + num(c.coins.sp) / 10 + num(c.coins.ep) / 2 + num(c.coins.gp) + num(c.coins.pp) * 10;
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Coins",
      icon: /*#__PURE__*/React.createElement(IconStar, {
        className: "w-3.5 h-3.5"
      }),
      right: /*#__PURE__*/React.createElement("span", {
        className: "text-[11px] text-neutral-500"
      }, "≈ ", Math.round(coinTotalGp * 100) / 100, " gp")
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-5 gap-1.5"
    }, COIN_TYPES.map(k => /*#__PURE__*/React.createElement("label", {
      key: k,
      className: "flex flex-col items-center gap-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold uppercase text-neutral-500"
    }, k), /*#__PURE__*/React.createElement(NumIn, {
      value: c.coins[k],
      onChange: v => set(x => ({
        ...x,
        coins: {
          ...x.coins,
          [k]: v
        }
      })),
      max: 9999999,
      className: "w-full !px-0.5"
    }))))), /*#__PURE__*/React.createElement(Card, {
      title: "Inventory",
      icon: /*#__PURE__*/React.createElement(IconBag, {
        className: "w-3.5 h-3.5"
      }),
      right: /*#__PURE__*/React.createElement("span", {
        className: `text-[11px] tabular-nums ${over ? "text-rose-300" : "text-neutral-500"}`
      }, Math.round(d.carried * 10) / 10, " / ", d.capacity, " lb")
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-2 rounded-full bg-neutral-800 overflow-hidden mb-3",
      role: "progressbar",
      "aria-valuenow": Math.round(pct),
      "aria-label": "Carrying capacity"
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full rounded-full ${over ? "bg-rose-500" : "bg-amber-500"}`,
      style: {
        width: `${pct}%`
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, c.items.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500"
    }, "Nothing carried yet."), c.items.map(it => /*#__PURE__*/React.createElement("div", {
      key: it.id,
      className: "rounded-xl border border-neutral-700/80 bg-neutral-950/60 px-2 py-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.upd(it.id, {
        equipped: !it.equipped
      }),
      "aria-pressed": it.equipped,
      "aria-label": `${it.equipped ? "Unequip" : "Equip"} ${it.name}`,
      className: `w-6 h-6 shrink-0 rounded-md border flex items-center justify-center ${it.equipped ? "border-amber-400 bg-amber-500/20 text-amber-300" : "border-neutral-600 text-transparent"}`
    }, /*#__PURE__*/React.createElement(IconCheck, {
      className: "w-4 h-4"
    })), edit ? /*#__PURE__*/React.createElement(TextIn, {
      value: it.name,
      onChange: v => ops.upd(it.id, {
        name: v
      }),
      className: "flex-1"
    }) : /*#__PURE__*/React.createElement("span", {
      className: "flex-1 min-w-0 truncate text-sm"
    }, it.name), /*#__PURE__*/React.createElement(Stepper, {
      value: it.qty,
      onChange: v => ops.upd(it.id, {
        qty: v
      }),
      max: 999,
      label: `${it.name} quantity`
    })), edit ? /*#__PURE__*/React.createElement("div", {
      className: "mt-1.5 flex items-center gap-1.5 pl-8"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-neutral-500"
    }, "lb each"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: "0.1",
      min: "0",
      value: it.weight,
      onChange: e => ops.upd(it.id, {
        weight: e.target.value
      }),
      "aria-label": "Weight each",
      className: `${inputCls} w-16 text-center`
    }), /*#__PURE__*/React.createElement(TextIn, {
      value: it.notes,
      onChange: v => ops.upd(it.id, {
        notes: v
      }),
      placeholder: "Notes",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => ops.del(it.id),
      "aria-label": `Delete ${it.name}`,
      className: "text-neutral-600 hover:text-rose-300"
    }, /*#__PURE__*/React.createElement(IconTrash, {
      className: "w-4 h-4"
    }))) : (num(it.weight) > 0 || it.notes) && /*#__PURE__*/React.createElement("p", {
      className: "pl-8 text-[11px] text-neutral-500"
    }, parseFloat(it.weight) > 0 ? `${Math.round(num(it.qty) * parseFloat(it.weight) * 10) / 10} lb` : "", it.notes ? ` · ${it.notes}` : "")))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: draft,
      onChange: setDraft,
      placeholder: "Add an item…",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: add,
      "aria-label": "Add item",
      className: `${btnPrimary} !px-3`
    }, /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-4 h-4"
    })))));
  }

  // ───────────────────────── NOTES ─────────────────────────
  function NotesTab({
    c,
    set
  }) {
    const {
      labels
    } = useContext(Ctx);
    const bio = k => v => set(x => ({
      ...x,
      bio: {
        ...x.bio,
        [k]: v
      }
    }));
    const field = (k, label, rows = 2) => /*#__PURE__*/React.createElement("label", {
      key: k,
      className: "block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-bold uppercase tracking-wider text-neutral-500"
    }, label), /*#__PURE__*/React.createElement(TextArea, {
      value: c.bio[k],
      onChange: bio(k),
      rows: rows
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Personality",
      icon: /*#__PURE__*/React.createElement(IconUser, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, field("traits", "Personality traits"), field("ideals", "Ideals"), field("bonds", "Bonds"), field("flaws", "Flaws"), field("appearance", "Appearance", 3))), /*#__PURE__*/React.createElement(Card, {
      title: "Proficiencies & Languages",
      icon: /*#__PURE__*/React.createElement(IconBook, {
        className: "w-3.5 h-3.5"
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, field("armorProf", "Armor"), field("weaponProf", "Weapons"), field("toolProf", "Tools"), field("languages", "Languages"))), /*#__PURE__*/React.createElement(Card, {
      title: "Notes",
      icon: /*#__PURE__*/React.createElement(IconScroll, {
        className: "w-3.5 h-3.5"
      })
    }, field("notes", "Campaign notes", 8)));
  }
  const romanOf = n => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][n];
  function MiniDots({
    total,
    used,
    color
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-[2px]"
    }, Array.from({
      length: total
    }, (_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: `w-1.5 h-1.5 rounded-full border ${i < total - used ? color : "border-neutral-600 bg-transparent"}`
    })));
  }
  // Bottom bar: Rest (left), tappable resource summary (center), Dice (right, in App).
  function resourceItems(c) {
    const items = [];
    if (!c.slotsHidden) for (let l = 1; l <= 9; l++) {
      const m = num(c.slots[l].max);
      if (m > 0) items.push({
        k: `s${l}`,
        kind: "slot",
        level: l,
        label: romanOf(l),
        total: m,
        used: num(c.slots[l].used),
        color: "bg-sky-400 border-sky-300",
        name: `Level ${l} slots`
      });
    }
    c.resources.forEach(r => {
      if (r.kind === "custom" && num(r.max) > 0) {
        const initials = (r.name || "?").split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join("").slice(0, 3);
        items.push({
          k: r.id,
          kind: "custom",
          id: r.id,
          label: initials,
          total: num(r.max),
          used: num(r.used),
          color: "bg-amber-400 border-amber-300",
          name: r.name
        });
      }
    });
    return items;
  }
  function ResourceStrip({
    c,
    set,
    onAdd,
    onEdit
  }) {
    const {
      edit
    } = useContext(Ctx);
    const items = resourceItems(c);
    const timer = useRef(null);
    const held = useRef(false);
    const change = (it, dir) => set(x => {
      if (it.kind === "slot") {
        const sl = x.slots[it.level];
        return {
          ...x,
          slots: {
            ...x.slots,
            [it.level]: {
              ...sl,
              used: clamp(num(sl.used) + dir, 0, num(sl.max))
            }
          }
        };
      }
      return {
        ...x,
        resources: x.resources.map(r => r.id === it.id ? {
          ...r,
          used: clamp(num(r.used) + dir, 0, num(r.max))
        } : r)
      };
    });
    const down = it => {
      held.current = false;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        held.current = true;
        change(it, -1);
      }, 450);
    };
    const up = () => clearTimeout(timer.current);
    if (items.length === 0) {
      return /*#__PURE__*/React.createElement("button", {
        onClick: onAdd,
        "aria-label": "Add resource",
        className: "flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-amber-300 px-2 py-0.5"
      }, /*#__PURE__*/React.createElement(IconPlus, {
        className: "w-3 h-3"
      }), "Add Resource");
    }
    return /*#__PURE__*/React.createElement("div", {
      "aria-label": "Resource summary",
      className: "flex flex-wrap items-center justify-center gap-x-1 gap-y-0"
    }, items.map(it => /*#__PURE__*/React.createElement("button", {
      key: it.k,
      "aria-label": `${it.name}: ${it.total - it.used} of ${it.total} left. Tap to spend one, hold to regain one`,
      title: edit ? `Edit ${it.name}` : `${it.name} (tap: spend, hold: regain)`,
      onPointerDown: () => down(it),
      onPointerUp: up,
      onPointerLeave: up,
      onContextMenu: e => e.preventDefault(),
      onClick: () => {
        if (edit) {
          onEdit(it);
          return;
        }
        if (held.current) {
          held.current = false;
          return;
        }
        change(it, 1);
      },
      className: "inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-bold text-neutral-400 active:bg-neutral-800 select-none touch-manipulation"
    }, it.label, it.total <= 8 ? /*#__PURE__*/React.createElement(MiniDots, {
      total: it.total,
      used: it.used,
      color: it.color
    }) : /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums text-neutral-300"
    }, it.total - it.used, "/", it.total))), edit && /*#__PURE__*/React.createElement("button", {
      onClick: onAdd,
      "aria-label": "Add resource",
      className: "ml-0.5 w-6 h-6 rounded-full border border-amber-600 text-amber-300 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IconPlus, {
      className: "w-3.5 h-3.5"
    })));
  }
  function ResourceEditModal({
    c,
    set,
    item,
    onClose
  }) {
    const r = item.kind === "custom" ? c.resources.find(x => x.id === item.id) : null;
    const upd = patch => set(x => ({
      ...x,
      resources: x.resources.map(q => q.id === item.id ? {
        ...q,
        ...patch
      } : q)
    }));
    if (item.kind === "slot" || !r) {
      return /*#__PURE__*/React.createElement(Modal, {
        title: "Spell Slots",
        onClose: onClose
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-neutral-300"
      }, "Slots come from the Spells tab (edit mode sets how many you have at each level)."), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          set(x => ({
            ...x,
            slotsHidden: true
          }));
          onClose();
        },
        className: `${btnDanger} w-full mt-3`
      }, "Remove spell slots from this bar"), /*#__PURE__*/React.createElement("button", {
        onClick: onClose,
        className: `${btnGhost} w-full mt-2`
      }, "Done"));
    }
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Edit Resource",
      onClose: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: r.name,
      onChange: v => upd({
        name: v
      }),
      placeholder: "Resource name",
      className: "w-full"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 text-xs text-neutral-400"
    }, /*#__PURE__*/React.createElement("span", null, "Max"), /*#__PURE__*/React.createElement(Stepper, {
      value: r.max,
      onChange: v => upd({
        max: v,
        used: Math.min(num(r.used), v)
      }),
      min: 1,
      max: 99,
      label: `${r.name} max`
    }), /*#__PURE__*/React.createElement("select", {
      value: r.recharge,
      onChange: e => upd({
        recharge: e.target.value
      }),
      "aria-label": "Recharge",
      className: `${inputCls} flex-1`
    }, /*#__PURE__*/React.createElement("option", {
      value: "none"
    }, "No recharge"), /*#__PURE__*/React.createElement("option", {
      value: "short"
    }, "Short rest"), /*#__PURE__*/React.createElement("option", {
      value: "long"
    }, "Long rest"))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2 pt-1"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        set(x => ({
          ...x,
          resources: x.resources.filter(q => q.id !== item.id)
        }));
        onClose();
      },
      "aria-label": `Delete ${r.name}`,
      className: btnDanger
    }, "Delete"), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      className: btnPrimary
    }, "Done"))));
  }
  function ResourceAddModal({
    c,
    set,
    onClose
  }) {
    const [name, setName] = useState("");
    const [max, setMax] = useState(3);
    const [rc, setRc] = useState("long");
    const add = () => {
      if (!name.trim()) return;
      set(x => ({
        ...x,
        resources: [...x.resources, {
          id: uid(),
          kind: "custom",
          name: name.trim(),
          max,
          used: 0,
          recharge: rc
        }]
      }));
      onClose();
    };
    const hasSlotData = [1, 2, 3, 4, 5, 6, 7, 8, 9].some(l => num(c.slots[l].max) > 0);
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Add Resource",
      onClose: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: name,
      onChange: setName,
      placeholder: "Rage, Ki points, Channel Divinity…",
      className: "w-full"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 text-xs text-neutral-400"
    }, /*#__PURE__*/React.createElement("span", null, "Uses"), /*#__PURE__*/React.createElement(Stepper, {
      value: max,
      onChange: setMax,
      min: 1,
      max: 99,
      label: "New resource max"
    }), /*#__PURE__*/React.createElement("select", {
      value: rc,
      onChange: e => setRc(e.target.value),
      "aria-label": "Recharge",
      className: `${inputCls} flex-1`
    }, /*#__PURE__*/React.createElement("option", {
      value: "none"
    }, "No recharge"), /*#__PURE__*/React.createElement("option", {
      value: "short"
    }, "Short rest"), /*#__PURE__*/React.createElement("option", {
      value: "long"
    }, "Long rest"))), /*#__PURE__*/React.createElement("button", {
      onClick: add,
      className: `${btnPrimary} w-full`
    }, "Add"), c.slotsHidden && hasSlotData && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        set(x => ({
          ...x,
          slotsHidden: false
        }));
        onClose();
      },
      className: `${btnGhost} w-full`
    }, "Track spell slots again")));
  }
  // ───────────────────────── shell helpers ─────────────────────────
  function normalizeChar(raw) {
    const base = newChar(raw && raw.name);
    const c = {
      ...base,
      ...raw
    };
    c.abilities = {
      ...base.abilities,
      ...(raw.abilities || {})
    };
    c.saveProf = {
      ...base.saveProf,
      ...(raw.saveProf || {})
    };
    c.skillProf = {
      ...base.skillProf,
      ...(raw.skillProf || {})
    };
    c.hp = {
      ...base.hp,
      ...(raw.hp || {})
    };
    c.deathSaves = {
      ...base.deathSaves,
      ...(raw.deathSaves || {})
    };
    c.economy = {
      ...base.economy,
      ...(raw.economy || {})
    };
    c.coins = {
      ...base.coins,
      ...(raw.coins || {})
    };
    c.bio = {
      ...base.bio,
      ...(raw.bio || {})
    };
    c.slots = {
      ...base.slots
    };
    for (let i = 1; i <= 9; i++) c.slots[i] = {
      ...base.slots[i],
      ...((raw.slots || {})[i] || {})
    };
    ["conditions", "attacks", "spells", "features", "items", "resources"].forEach(k => {
      if (!Array.isArray(c[k])) c[k] = [];
    });
    c.resources = c.resources.filter(r => r && r.kind !== "slots"); // slots now live in the bottom bar automatically
    return c;
  }
  function downloadJSON(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function fileToPortrait(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const s = 192;
          const cv = document.createElement("canvas");
          cv.width = s;
          cv.height = s;
          const m = Math.min(img.width, img.height);
          cv.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
          resolve(cv.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = fr.result;
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }
  function Avatar({
    c,
    size = "w-11 h-11"
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: `${size} shrink-0 rounded-full overflow-hidden border-2 border-amber-600/70 bg-neutral-800 flex items-center justify-center text-amber-200 font-serif font-bold`
    }, c.portrait ? /*#__PURE__*/React.createElement("img", {
      src: c.portrait,
      alt: "",
      className: "w-full h-full object-cover"
    }) : (c.name || "?").trim().charAt(0).toUpperCase() || /*#__PURE__*/React.createElement(IconUser, {
      className: "w-5 h-5"
    }));
  }

  // ───────────────────────── modals ─────────────────────────
  function HpModal({
    c,
    set,
    onClose,
    setResult,
    toast
  }) {
    const [amt, setAmt] = useState("");
    const n = num(amt);
    const apply = (fn, msg) => {
      if (n <= 0) return;
      set(x => fn(x, n));
      toast(msg(n));
      onClose();
    };
    const down = num(c.hp.cur) === 0;
    const up = patch => set(x => ({
      ...x,
      deathSaves: {
        ...x.deathSaves,
        ...patch
      }
    }));
    const deathSave = () => {
      const r = rnd(20);
      let note;
      let ds = {
        ...c.deathSaves
      };
      if (r === 20) {
        note = "Natural 20. You regain 1 hit point.";
        set(x => healChar({
          ...x,
          deathSaves: {
            s: 0,
            f: 0
          }
        }, 1));
      } else {
        if (r === 1) {
          ds.f = Math.min(3, ds.f + 2);
          note = "Natural 1. Two failures.";
        } else if (r >= 10) {
          ds.s = Math.min(3, ds.s + 1);
          note = "Success.";
        } else {
          ds.f = Math.min(3, ds.f + 1);
          note = "Failure.";
        }
        if (ds.s >= 3) note += " Stable.";
        if (ds.f >= 3) note += " You have died.";
        set(x => ({
          ...x,
          deathSaves: ds
        }));
      }
      setResult({
        label: "Death saving throw",
        total: r,
        detail: "d20",
        crit: r === 20 ? "20" : r === 1 ? "1" : null,
        note
      });
      onClose();
    };
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Hit Points",
      onClose: onClose
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-center font-serif text-3xl font-bold tabular-nums text-rose-300"
    }, num(c.hp.cur), /*#__PURE__*/React.createElement("span", {
      className: "text-neutral-500 text-xl"
    }, " / ", num(c.hp.max)), num(c.hp.temp) > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-sky-300 text-lg"
    }, " +", num(c.hp.temp))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      inputMode: "numeric",
      min: "0",
      value: amt,
      onChange: e => setAmt(e.target.value),
      placeholder: "Amount",
      autoFocus: true,
      "aria-label": "Amount",
      className: `${inputCls} flex-1 text-center text-lg py-2`
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 grid grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => apply(damageChar, v => `Took ${v} damage`),
      className: btnDanger
    }, "Damage"), /*#__PURE__*/React.createElement("button", {
      onClick: () => apply(healChar, v => `Healed ${v}`),
      className: `${btnCls} bg-emerald-700 hover:bg-emerald-600 text-white`
    }, "Heal"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (n >= 0 && amt !== "") {
          set(x => ({
            ...x,
            hp: {
              ...x.hp,
              temp: n
            }
          }));
          toast(`Temp HP set to ${n}`);
          onClose();
        }
      },
      className: `${btnCls} bg-sky-700 hover:bg-sky-600 text-white`
    }, "Temp HP")), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-neutral-500 mt-1.5"
    }, "Damage uses up temporary hit points first. Temp HP replaces the current amount."), down && /*#__PURE__*/React.createElement("div", {
      className: "mt-4 rounded-xl border border-rose-900 bg-rose-950/30 p-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "flex items-center gap-1.5 text-sm font-semibold text-rose-200"
    }, /*#__PURE__*/React.createElement(IconSkull, {
      className: "w-4 h-4"
    }), "Death saving throws"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-16 text-xs text-neutral-400"
    }, "Successes"), /*#__PURE__*/React.createElement(Pips, {
      total: 3,
      used: 3 - c.deathSaves.s,
      onChange: u => up({
        s: 3 - u
      }),
      color: "emerald",
      label: "Death save success"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-16 text-xs text-neutral-400"
    }, "Failures"), /*#__PURE__*/React.createElement(Pips, {
      total: 3,
      used: 3 - c.deathSaves.f,
      onChange: u => up({
        f: 3 - u
      }),
      color: "rose",
      label: "Death save failure"
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: deathSave,
      className: `${btnPrimary} w-full mt-3`
    }, "Roll death save")));
  }
  function RestModal({
    c,
    set,
    onClose,
    spendHitDie,
    toast
  }) {
    const [kind, setKind] = useState("short");
    const d = derive(c);
    const finishShort = () => {
      set(x => ({
        ...x,
        features: x.features.map(f => f.recharge === "short" ? {
          ...f,
          used: 0
        } : f),
        resources: x.resources.map(r => r.kind === "custom" && r.recharge === "short" ? {
          ...r,
          used: 0
        } : r)
      }));
      toast("Short rest finished");
      onClose();
    };
    const longRest = () => {
      set(x => {
        const slots = {};
        for (let i = 1; i <= 9; i++) slots[i] = {
          ...x.slots[i],
          used: 0
        };
        return {
          ...x,
          hp: {
            ...x.hp,
            cur: num(x.hp.max),
            temp: 0
          },
          deathSaves: {
            s: 0,
            f: 0
          },
          slots,
          hitDiceUsed: 0,
          exhaustion: Math.max(0, num(x.exhaustion) - 1),
          concentrating: "",
          features: x.features.map(f => f.recharge === "short" || f.recharge === "long" ? {
            ...f,
            used: 0
          } : f),
          resources: x.resources.map(r => r.kind === "custom" && (r.recharge === "short" || r.recharge === "long") ? {
            ...r,
            used: 0
          } : r),
          economy: {
            action: false,
            bonus: false,
            reaction: false,
            moved: 0
          }
        };
      });
      toast("Long rest complete");
      onClose();
    };
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Rest",
      onClose: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1 rounded-xl bg-neutral-950 p-1 mb-3"
    }, [["short", "Short rest", IconFlame], ["long", "Long rest", IconMoon]].map(([k, label, Ic]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => setKind(k),
      "aria-pressed": kind === k,
      className: `flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold ${kind === k ? "bg-amber-500 text-neutral-950" : "text-neutral-400"}`
    }, /*#__PURE__*/React.createElement(Ic, {
      className: "w-4 h-4"
    }), label))), kind === "short" ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-300"
    }, "Spend hit dice to heal. You have ", /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-amber-200"
    }, d.hitDiceLeft), " of ", num(c.level), " d", num(c.hitDie), " left."), /*#__PURE__*/React.createElement("button", {
      onClick: spendHitDie,
      disabled: d.hitDiceLeft === 0 || num(c.hp.cur) >= num(c.hp.max),
      className: `${btnGhost} w-full disabled:opacity-40`
    }, "Spend a hit die (d", num(c.hitDie), " ", fmt(d.mods.con), ")"), /*#__PURE__*/React.createElement("button", {
      onClick: finishShort,
      className: `${btnPrimary} w-full`
    }, "Finish short rest"), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-neutral-500"
    }, "Finishing restores features and resources that recharge on a short rest.")) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "text-sm text-neutral-300 list-disc pl-5 space-y-0.5"
    }, /*#__PURE__*/React.createElement("li", null, "Hit points restored to full, temp HP cleared"), /*#__PURE__*/React.createElement("li", null, "All spell slots restored"), /*#__PURE__*/React.createElement("li", null, "All hit dice recovered"), /*#__PURE__*/React.createElement("li", null, "Short and long rest features and resources recharge"), /*#__PURE__*/React.createElement("li", null, "Exhaustion reduced by 1")), /*#__PURE__*/React.createElement("button", {
      onClick: longRest,
      className: `${btnPrimary} w-full`
    }, "Take a long rest")));
  }
  function ConditionsModal({
    c,
    set,
    onClose
  }) {
    const [conc, setConc] = useState("");
    const toggle = n => set(x => ({
      ...x,
      conditions: x.conditions.includes(n) ? x.conditions.filter(v => v !== n) : [...x.conditions, n]
    }));
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Conditions",
      onClose: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5"
    }, CONDITIONS.map(n => {
      const on = c.conditions.includes(n);
      return /*#__PURE__*/React.createElement("button", {
        key: n,
        onClick: () => toggle(n),
        "aria-pressed": on,
        className: `text-sm rounded-full border px-3 py-1.5 ${on ? "border-violet-500 bg-violet-900/40 text-violet-100" : "border-neutral-700 text-neutral-400 hover:border-neutral-500"}`
      }, n);
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm"
    }, "Exhaustion"), /*#__PURE__*/React.createElement(Stepper, {
      value: c.exhaustion,
      onChange: v => set(x => ({
        ...x,
        exhaustion: v
      })),
      max: 6,
      label: "Exhaustion level"
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm mb-1.5"
    }, "Concentration"), c.concentrating ? /*#__PURE__*/React.createElement("button", {
      onClick: () => set(x => ({
        ...x,
        concentrating: ""
      })),
      className: `${btnGhost} w-full`
    }, "Stop concentrating", c.concentrating !== "Concentrating" ? ` on ${c.concentrating}` : "") : /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5"
    }, /*#__PURE__*/React.createElement(TextIn, {
      value: conc,
      onChange: setConc,
      placeholder: "Spell (optional)",
      className: "flex-1"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        set(x => ({
          ...x,
          concentrating: conc.trim() || "Concentrating"
        }));
        setConc("");
      },
      className: btnPrimary
    }, "Start"))), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      className: `${btnPrimary} w-full mt-4`
    }, "Done"));
  }
  function DiceRoller({
    onRoll
  }) {
    const [open, setOpen] = useState(false);
    const [sel, setSel] = useState(null);
    const [count, setCount] = useState(1);
    const box = useRef(null);
    const close = () => {
      setOpen(false);
      setSel(null);
      setCount(1);
    };
    useEffect(() => {
      if (!open) return;
      const away = e => {
        if (box.current && !box.current.contains(e.target)) {
          setOpen(false);
          setSel(null);
          setCount(1);
        }
      };
      document.addEventListener("pointerdown", away);
      return () => document.removeEventListener("pointerdown", away);
    }, [open]);
    const roll = (sides, n) => {
      const rolls = Array.from({
        length: n
      }, () => rnd(sides));
      onRoll({
        label: `${n}d${sides}`,
        total: sum(rolls),
        detail: n > 1 ? rolls.join(" + ") : `d${sides}`,
        crit: n === 1 && sides === 20 ? rolls[0] === 20 ? "20" : rolls[0] === 1 ? "1" : null : null,
        redo: () => roll(sides, n)
      });
      close();
    };
    const pick = s => {
      if (sel === s) roll(s, count);else setSel(s);
    };
    return /*#__PURE__*/React.createElement("div", {
      ref: box,
      className: "relative shrink-0 flex"
    }, open && /*#__PURE__*/React.createElement("div", {
      className: "absolute right-0 bottom-full mb-3 w-64 rounded-2xl border border-amber-700/60 bg-neutral-900 p-2.5 shadow-2xl z-40"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4 gap-1.5"
    }, [4, 6, 8, 10, 12, 20, 100].map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: () => pick(s),
      "aria-label": sel === s ? `Roll ${count}d${s}` : `Select d${s}`,
      "aria-pressed": sel === s,
      className: `h-10 rounded-xl text-sm font-bold ${sel === s ? "bg-amber-500 text-neutral-950" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`
    }, "d", s))), sel ? /*#__PURE__*/React.createElement("div", {
      className: "mt-2.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: Math.min(count, 10),
      onChange: e => setCount(Number(e.target.value)),
      "aria-label": "Dice count slider",
      className: "flex-1 w-0 min-w-0 accent-amber-500"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      inputMode: "numeric",
      min: "1",
      max: "100",
      value: count,
      onChange: e => setCount(clamp(Math.floor(Number(e.target.value)) || 1, 1, 100)),
      "aria-label": "Dice count",
      className: `${inputCls} w-14 shrink-0 text-center`
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => roll(sel, count),
      className: `${btnPrimary} w-full mt-2`
    }, "Roll ", count, "d", sel)) : /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-neutral-500 mt-2 text-center"
    }, "Pick a die. Tap it again to roll.")), /*#__PURE__*/React.createElement("button", {
      onClick: () => open ? close() : setOpen(true),
      "aria-label": "Dice roller",
      "aria-expanded": open,
      className: `w-14 h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${open ? "text-amber-300" : "text-neutral-300"} active:text-amber-300`
    }, /*#__PURE__*/React.createElement(IconD20, {
      className: "w-5 h-5"
    }), "Dice"));
  }
  function CharactersModal({
    store,
    setStore,
    onClose,
    askConfirm,
    toast,
    importRef,
    onSwitch
  }) {
    const {
      chars,
      order,
      activeId,
      settings
    } = store;
    const switchTo = id => {
      setStore(s => ({
        ...s,
        activeId: id
      }));
      onClose();
    };
    const create = () => {
      const c = newChar("New Character");
      setStore(s => ({
        ...s,
        chars: {
          ...s.chars,
          [c.id]: c
        },
        order: [...s.order, c.id],
        activeId: c.id
      }));
      onClose();
    };
    const sample = () => {
      const c = sampleChar();
      setStore(s => ({
        ...s,
        chars: {
          ...s.chars,
          [c.id]: c
        },
        order: [...s.order, c.id],
        activeId: c.id
      }));
      onClose();
    };
    const dup = id => {
      const src = chars[id];
      const c = normalizeChar(JSON.parse(JSON.stringify(src)));
      c.id = uid();
      c.name = `${src.name} (copy)`;
      setStore(s => ({
        ...s,
        chars: {
          ...s.chars,
          [c.id]: c
        },
        order: [...s.order, c.id],
        activeId: c.id
      }));
      toast("Duplicated");
      onClose();
    };
    const remove = id => askConfirm(`Delete ${chars[id].name}? This can't be undone.`, () => {
      setStore(s => {
        const nextChars = {
          ...s.chars
        };
        delete nextChars[id];
        let nextOrder = s.order.filter(v => v !== id);
        if (nextOrder.length === 0) {
          const c = newChar("New Character");
          nextChars[c.id] = c;
          nextOrder = [c.id];
        }
        return {
          ...s,
          chars: nextChars,
          order: nextOrder,
          activeId: s.activeId === id ? nextOrder[0] : s.activeId
        };
      });
    });
    const exportOne = id => downloadJSON(`${(chars[id].name || "character").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, {
      format: "initsheet",
      version: 1,
      chars: [chars[id]]
    });
    const exportAll = () => downloadJSON("initsheet-backup.json", {
      format: "initsheet",
      version: 1,
      chars: order.map(id => chars[id])
    });
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Characters",
      onClose: onClose,
      wide: true
    }, onSwitch && /*#__PURE__*/React.createElement("button", {
      onClick: onSwitch,
      "aria-label": "Switch to GM mode",
      className: `${btnGhost} w-full mb-3 border border-sky-700/70 !bg-sky-950/30 text-sky-200`
    }, "Switch to GM mode (initiative tracker)"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, order.map(id => {
      const c = chars[id];
      const on = id === activeId;
      return /*#__PURE__*/React.createElement("div", {
        key: id,
        className: `rounded-xl border p-2 ${on ? "border-amber-500 bg-amber-500/10" : "border-neutral-700/80 bg-neutral-950/60"}`
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => switchTo(id),
        className: "w-full flex items-center gap-2 text-left",
        "aria-label": `Open ${c.name}`
      }, /*#__PURE__*/React.createElement(Avatar, {
        c: c,
        size: "w-10 h-10"
      }), /*#__PURE__*/React.createElement("span", {
        className: "flex-1 min-w-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "block text-sm font-semibold truncate"
      }, c.name), /*#__PURE__*/React.createElement("span", {
        className: "block text-xs text-neutral-500 truncate"
      }, [c.cls, `Lv ${num(c.level)}`, c.species].filter(Boolean).join(" · "))), on && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] uppercase text-amber-300"
      }, "Active")), /*#__PURE__*/React.createElement("div", {
        className: "flex justify-end gap-3 mt-1 pr-1 text-neutral-500"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => dup(id),
        "aria-label": `Duplicate ${c.name}`,
        className: "hover:text-neutral-200"
      }, /*#__PURE__*/React.createElement(IconCopy, {
        className: "w-4 h-4"
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => exportOne(id),
        "aria-label": `Export ${c.name}`,
        className: "hover:text-neutral-200"
      }, /*#__PURE__*/React.createElement(IconDownload, {
        className: "w-4 h-4"
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => remove(id),
        "aria-label": `Delete ${c.name}`,
        className: "hover:text-rose-300"
      }, /*#__PURE__*/React.createElement(IconTrash, {
        className: "w-4 h-4"
      }))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2 mt-3"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: create,
      className: btnPrimary
    }, "New character"), /*#__PURE__*/React.createElement("button", {
      onClick: sample,
      className: btnGhost
    }, "Add sample"), /*#__PURE__*/React.createElement("button", {
      onClick: () => importRef.current && importRef.current.click(),
      className: `${btnGhost} flex items-center justify-center gap-1.5`
    }, /*#__PURE__*/React.createElement(IconUpload, {
      className: "w-4 h-4"
    }), "Import"), /*#__PURE__*/React.createElement("button", {
      onClick: exportAll,
      className: `${btnGhost} flex items-center justify-center gap-1.5`
    }, /*#__PURE__*/React.createElement(IconDownload, {
      className: "w-4 h-4"
    }), "Export all")), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 border-t border-neutral-800 pt-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-neutral-500 mb-1.5"
    }, "Rules edition (changes a few labels)"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1 rounded-xl bg-neutral-950 p-1"
    }, ["2014", "2024"].map(r => /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: () => setStore(s => ({
        ...s,
        settings: {
          ...s.settings,
          ruleset: r
        }
      })),
      "aria-pressed": settings.ruleset === r,
      className: `rounded-lg py-1.5 text-sm font-semibold ${settings.ruleset === r ? "bg-amber-500 text-neutral-950" : "text-neutral-400"}`
    }, r))), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-neutral-600 mt-2"
    }, "Characters are saved on this device only. Use Export to keep a backup or move them to another device.")));
  }

  // ───────────────────────── app ─────────────────────────
  const TABS = [["actions", "Actions", IconSword], ["stats", "Traits", IconUser], ["spells", "Spells", IconSparkles]];
  function App({
    onSwitch
  }) {
    const [store, setStore] = useState(loadStore);
    const [tab, setTab] = useState("stats");
    const [view, setView] = useState("tabs"); // "tabs", "notes" or "gear"
    const touch = useRef(null);
    const [edit, setEdit] = useState(false);
    const [demo, setDemo] = useState(false);
    const [resEdit, setResEdit] = useState(null);
    const [modal, setModal] = useState(null);
    const [result, setResult] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [toastMsg, setToastMsg] = useState("");
    const importRef = useRef(null);
    const portraitRef = useRef(null);
    const toastTimer = useRef(null);
    useEffect(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
      } catch (e) {/* storage full or blocked */}
    }, [store]);
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [tab, view]);
    const goTab = k => {
      setTab(k);
      setView("tabs");
    };
    const onTouchStart = e => {
      const t = e.touches[0];
      touch.current = e.target.closest && e.target.closest("input,textarea,select") ? null : {
        x: t.clientX,
        y: t.clientY
      };
    };
    const onTouchEnd = e => {
      const st = touch.current;
      touch.current = null;
      if (!st || view !== "tabs" || modal || result || confirm) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - st.x,
        dy = t.clientY - st.y;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
      const i = TABS.findIndex(([k]) => k === tab);
      const n = i + (dx < 0 ? 1 : -1);
      if (n >= 0 && n < TABS.length) setTab(TABS[n][0]);
    };
    const activeId = store.chars[store.activeId] ? store.activeId : store.order[0];
    const c = normalizeChar(store.chars[activeId]);
    const labels = labelsFor(store.settings.ruleset);
    const d = derive(c);
    const set = fn => setStore(s => ({
      ...s,
      chars: {
        ...s.chars,
        [activeId]: fn(normalizeChar(s.chars[activeId]))
      }
    }));
    const toast = m => {
      setToastMsg(m);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastMsg(""), 1900);
    };
    const askConfirm = (message, onYes) => setConfirm({
      message,
      onYes
    });
    const rollD20 = (label, bonus) => {
      const used = rnd(20);
      setResult({
        label,
        total: used + bonus,
        crit: used === 20 ? "20" : used === 1 ? "1" : null,
        detail: `d20 [${used}] ${bonus >= 0 ? "+" : "−"} ${Math.abs(bonus)}`,
        redo: () => rollD20(label, bonus)
      });
    };
    const rollDamage = (label, expr) => {
      const r = rollExpression(expr);
      if (!r) {
        toast("Can't read that damage formula");
        return;
      }
      setResult({
        label,
        total: r.total,
        detail: r.detail,
        redo: () => rollDamage(label, expr)
      });
    };
    const spendHitDie = () => {
      if (d.hitDiceLeft === 0) {
        toast("No hit dice left");
        return;
      }
      const die = num(c.hitDie) || 8;
      const r = rnd(die);
      const heal = Math.max(0, r + d.mods.con);
      set(x => ({
        ...healChar(x, heal),
        hitDiceUsed: num(x.hitDiceUsed) + 1
      }));
      setResult({
        label: `Hit die (d${die})`,
        total: heal,
        detail: `d${die} [${r}] ${d.mods.con >= 0 ? "+" : "−"} ${Math.abs(d.mods.con)}`,
        note: "Hit points regained."
      });
    };
    const pickPortrait = () => portraitRef.current && portraitRef.current.click();
    const onPortrait = async e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      try {
        const url = await fileToPortrait(f);
        set(x => ({
          ...x,
          portrait: url
        }));
      } catch (err) {
        toast("Couldn't read that image");
      }
    };
    const onImport = e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const data = JSON.parse(fr.result);
          const list = Array.isArray(data.chars) ? data.chars : data && data.abilities ? [data] : null;
          if (!list || list.length === 0) throw new Error("bad");
          const added = list.map(r => ({
            ...normalizeChar(r),
            id: uid()
          }));
          setStore(s => {
            const chars = {
              ...s.chars
            };
            added.forEach(a => {
              chars[a.id] = a;
            });
            return {
              ...s,
              chars,
              order: [...s.order, ...added.map(a => a.id)],
              activeId: added[0].id
            };
          });
          setModal(null);
          toast(`Imported ${added.length} character${added.length > 1 ? "s" : ""}`);
        } catch (err) {
          toast("That file isn't a character sheet export");
        }
      };
      fr.readAsText(f);
    };
    const hpPct = num(c.hp.max) > 0 ? clamp(num(c.hp.cur) / num(c.hp.max) * 100, 0, 100) : 0;
    const down = num(c.hp.cur) === 0;
    const ctx = {
      edit,
      labels,
      rollD20,
      rollDamage,
      spendHitDie,
      openModal: setModal,
      toast,
      pickPortrait
    };
    const Tab = view === "notes" ? NotesTab : view === "gear" ? GearTab : {
      stats: StatsTab,
      actions: ActionsTab,
      spells: SpellsTab
    }[tab];
    return /*#__PURE__*/React.createElement(Ctx.Provider, {
      value: ctx
    }, /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-neutral-950 text-neutral-100"
    }, demo && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-20 bg-black/40",
      onClick: () => setDemo(false),
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("header", {
      className: "sticky top-0 z-30 border-b border-amber-900/40 bg-neutral-950/95 backdrop-blur safe-top px-3 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setModal("chars"),
      "aria-label": "Characters",
      className: "rounded-full"
    }, /*#__PURE__*/React.createElement(Avatar, {
      c: c
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setDemo(v => !v),
      "aria-expanded": demo,
      "aria-label": "Character details",
      className: "flex-1 min-w-0 text-left flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block font-serif text-sm font-bold truncate leading-tight"
    }, c.name || "Unnamed"), /*#__PURE__*/React.createElement("span", {
      className: "block text-xs text-amber-200/80 truncate leading-tight"
    }, [c.cls, `Level ${num(c.level) || 1}`].filter(Boolean).join(" · "))), demo ? /*#__PURE__*/React.createElement(IconChevU, {
      className: "w-4 h-4 shrink-0 text-amber-300"
    }) : /*#__PURE__*/React.createElement(IconChevD, {
      className: "w-4 h-4 shrink-0 text-neutral-500"
    })), c.inspiration && /*#__PURE__*/React.createElement("span", {
      role: "img",
      "aria-label": "Inspiration",
      title: labels.inspiration,
      className: "shrink-0 w-7 h-7 rounded-full border border-amber-400 bg-amber-500/20 text-amber-300 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(IconSparkles, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setView(v => v === "gear" ? "tabs" : "gear"),
      "aria-pressed": view === "gear",
      "aria-label": "Gear",
      title: "Gear",
      className: `w-9 h-9 rounded-lg border flex items-center justify-center ${view === "gear" ? "border-amber-400 bg-amber-500 text-neutral-950" : "border-neutral-700 bg-neutral-900 text-neutral-300"}`
    }, /*#__PURE__*/React.createElement(IconBag, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setView(v => v === "notes" ? "tabs" : "notes"),
      "aria-pressed": view === "notes",
      "aria-label": "Notes",
      title: "Notes",
      className: `w-9 h-9 rounded-lg border flex items-center justify-center ${view === "notes" ? "border-amber-400 bg-amber-500 text-neutral-950" : "border-neutral-700 bg-neutral-900 text-neutral-300"}`
    }, /*#__PURE__*/React.createElement(IconScroll, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEdit(v => !v),
      "aria-pressed": edit,
      "aria-label": "Edit mode",
      title: "Edit mode",
      className: `w-9 h-9 rounded-lg border flex items-center justify-center ${edit ? "border-amber-400 bg-amber-500 text-neutral-950" : "border-neutral-700 bg-neutral-900 text-neutral-300"}`
    }, /*#__PURE__*/React.createElement(IconPencil, {
      className: "w-4 h-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setModal("hp"),
      "aria-label": "Hit points",
      className: "flex-1 relative h-8 rounded-lg border border-rose-900/80 bg-neutral-900 overflow-hidden text-left"
    }, /*#__PURE__*/React.createElement("span", {
      className: `absolute inset-y-0 left-0 ${down ? "bg-neutral-700" : hpPct > 50 ? "bg-rose-700" : hpPct > 25 ? "bg-orange-700" : "bg-red-800"}`,
      style: {
        width: `${hpPct}%`
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "relative z-10 flex items-center justify-between h-full px-2 text-sm font-bold"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1.5"
    }, down ? /*#__PURE__*/React.createElement(IconSkull, {
      className: "w-4 h-4 text-rose-200"
    }) : /*#__PURE__*/React.createElement(IconHeart, {
      className: "w-4 h-4 text-rose-200"
    }), down ? "Down" : "HP"), /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums"
    }, num(c.hp.cur), " / ", num(c.hp.max), num(c.hp.temp) > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-sky-300 text-xs"
    }, " +", num(c.hp.temp))))), /*#__PURE__*/React.createElement("span", {
      className: "h-8 px-2.5 rounded-lg border border-neutral-700 bg-neutral-900 flex items-center gap-1 text-sm font-bold",
      title: "Armor class"
    }, /*#__PURE__*/React.createElement(IconShield, {
      className: "w-4 h-4 text-amber-300"
    }), num(c.ac))), /*#__PURE__*/React.createElement(ConditionsBar, {
      c: c
    }), demo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "absolute left-0 right-0 top-full z-30 px-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md mx-auto rounded-b-2xl border border-t-0 border-amber-900/50 bg-neutral-900 p-3 shadow-2xl",
      role: "region",
      "aria-label": "Demographics"
    }, /*#__PURE__*/React.createElement(DemographicsPanel, {
      c: c,
      set: set
    })))))), edit && /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-500/15 border-b border-amber-700/50 text-center text-xs text-amber-200 py-1"
    }, "Edit mode: taps change your sheet instead of rolling. Tap the pencil when you're done."), /*#__PURE__*/React.createElement("main", {
      className: "max-w-md mx-auto px-3 pt-3 pb-32 min-h-[70vh]",
      onTouchStart: onTouchStart,
      onTouchEnd: onTouchEnd
    }, /*#__PURE__*/React.createElement(Tab, {
      c: c,
      set: set
    })), /*#__PURE__*/React.createElement("nav", {
      className: "fixed bottom-0 inset-x-0 z-30 border-t border-amber-900/40 bg-neutral-950/95 backdrop-blur safe-bottom"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md mx-auto flex justify-center items-center min-h-[1.75rem] px-3"
    }, /*#__PURE__*/React.createElement(ResourceStrip, {
      c: c,
      set: set,
      onAdd: () => setModal("addres"),
      onEdit: setResEdit
    })), /*#__PURE__*/React.createElement("div", {
      className: "max-w-md mx-auto flex items-stretch"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1 grid grid-cols-3"
    }, TABS.map(([k, label, Ic]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => goTab(k),
      "aria-current": view === "tabs" && tab === k ? "page" : undefined,
      "aria-label": label,
      className: `flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10px] font-semibold ${view === "tabs" && tab === k ? "text-amber-300" : "text-neutral-500"}`
    }, /*#__PURE__*/React.createElement(Ic, {
      className: "w-5 h-5"
    }), label, /*#__PURE__*/React.createElement("span", {
      className: `h-0.5 w-6 rounded-full ${view === "tabs" && tab === k ? "bg-amber-400" : "bg-transparent"}`
    })))), /*#__PURE__*/React.createElement("div", {
      className: "shrink-0 my-1 mr-2 ml-1 flex items-stretch rounded-xl border border-amber-900/50 bg-neutral-900/80 px-1"
    }, /*#__PURE__*/React.createElement(DiceRoller, {
      onRoll: setResult
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => setModal("rest"),
      "aria-label": "Rest",
      title: "Rest",
      className: "w-14 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-neutral-300 active:text-amber-300"
    }, /*#__PURE__*/React.createElement(IconMoon, {
      className: "w-5 h-5"
    }), "Rest")))), /*#__PURE__*/React.createElement("input", {
      ref: importRef,
      type: "file",
      accept: ".json,application/json",
      onChange: onImport,
      className: "hidden"
    }), /*#__PURE__*/React.createElement("input", {
      ref: portraitRef,
      type: "file",
      accept: "image/*",
      onChange: onPortrait,
      className: "hidden"
    }), modal === "hp" && /*#__PURE__*/React.createElement(HpModal, {
      c: c,
      set: set,
      onClose: () => setModal(null),
      setResult: setResult,
      toast: toast
    }), modal === "rest" && /*#__PURE__*/React.createElement(RestModal, {
      c: c,
      set: set,
      onClose: () => setModal(null),
      spendHitDie: spendHitDie,
      toast: toast
    }), resEdit && /*#__PURE__*/React.createElement(ResourceEditModal, {
      c: c,
      set: set,
      item: resEdit,
      onClose: () => setResEdit(null)
    }), modal === "addres" && /*#__PURE__*/React.createElement(ResourceAddModal, {
      c: c,
      set: set,
      onClose: () => setModal(null)
    }), modal === "conditions" && /*#__PURE__*/React.createElement(ConditionsModal, {
      c: c,
      set: set,
      onClose: () => setModal(null)
    }), modal === "chars" && /*#__PURE__*/React.createElement(CharactersModal, {
      store: store,
      setStore: setStore,
      onClose: () => setModal(null),
      askConfirm: askConfirm,
      toast: toast,
      importRef: importRef,
      onSwitch: onSwitch
    }), result && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
      onClick: () => setResult(null)
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-xs rounded-2xl border border-amber-700/60 bg-neutral-900 p-5 text-center shadow-2xl",
      onClick: e => e.stopPropagation(),
      role: "dialog",
      "aria-label": "Roll result"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs uppercase tracking-wider text-neutral-400"
    }, result.label), /*#__PURE__*/React.createElement("p", {
      className: `mt-1 font-serif text-7xl font-bold leading-none tabular-nums ${result.crit === "20" ? "text-emerald-300" : result.crit === "1" ? "text-rose-400" : "text-amber-300"}`,
      "data-testid": "roll-total"
    }, result.total), result.crit === "20" && /*#__PURE__*/React.createElement("p", {
      className: "mt-2 text-sm font-semibold text-emerald-300"
    }, "Natural 20!"), result.crit === "1" && /*#__PURE__*/React.createElement("p", {
      className: "mt-2 text-sm font-semibold text-rose-300"
    }, "Natural 1"), /*#__PURE__*/React.createElement("p", {
      className: "mt-3 text-xs text-neutral-400 break-words max-h-24 overflow-y-auto"
    }, result.detail), result.note && /*#__PURE__*/React.createElement("p", {
      className: "mt-2 text-sm text-neutral-200"
    }, result.note), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-5"
    }, result.redo && /*#__PURE__*/React.createElement("button", {
      onClick: () => result.redo(),
      className: `${btnGhost} flex-1`
    }, "Roll again"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setResult(null),
      className: `${btnPrimary} flex-1`
    }, "Close")))), confirm && /*#__PURE__*/React.createElement(Modal, {
      title: "Are you sure?",
      onClose: () => setConfirm(null)
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-neutral-300"
    }, confirm.message), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setConfirm(null),
      className: btnGhost
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const f = confirm.onYes;
        setConfirm(null);
        f();
      },
      className: btnDanger
    }, "Confirm"))), toastMsg && /*#__PURE__*/React.createElement("div", {
      role: "status",
      className: "fixed bottom-32 inset-x-0 z-50 flex justify-center pointer-events-none"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rounded-full bg-neutral-100 text-neutral-900 text-sm font-semibold px-4 py-2 shadow-lg"
    }, toastMsg))));
  }
  return App;
})();
// ───────────────────────── hub shell: Player / GM picker ─────────────────────────
const {
  useState,
  useEffect
} = React;
const HUB_KEY = "tableQuest.v1";
const SHEET_KEY = "initSheet.v1";

// Characters saved by the sheet side, reduced to what the tracker needs.
function readSheetChars() {
  try {
    const s = JSON.parse(localStorage.getItem(SHEET_KEY));
    if (!s || !s.chars) return [];
    return (s.order || Object.keys(s.chars)).map(id => s.chars[id]).filter(Boolean).map(c => {
      const dex = Number(c.abilities && c.abilities.dex) || 10;
      return {
        id: c.id,
        name: c.name || "Unnamed",
        initMod: Math.floor((dex - 10) / 2) + (Number(c.initMisc) || 0),
        cls: c.cls || "",
        level: Number(c.level) || 1
      };
    });
  } catch (e) {
    return [];
  }
}
function loadMode() {
  try {
    const m = JSON.parse(localStorage.getItem(HUB_KEY));
    return m && (m.mode === "player" || m.mode === "gm") ? m.mode : null;
  } catch (e) {
    return null;
  }
}
function ModePicker({
  onPick
}) {
  const Opt = ({
    mode,
    title,
    sub,
    tone
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => onPick(mode),
    "aria-label": `${title} mode`,
    className: `w-full text-left rounded-2xl border p-5 active:scale-[0.99] transition ${tone}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-serif text-2xl font-bold"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-neutral-300 mt-1"
  }, sub));
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-5 safe-top safe-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-sm space-y-3"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "font-serif text-3xl font-bold text-center text-amber-200"
  }, "TableQuest"), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-sm text-neutral-400 pb-3"
  }, "Choose how you're playing. You can switch any time from the menu."), /*#__PURE__*/React.createElement(Opt, {
    mode: "player",
    title: "Player",
    sub: "Your character sheet: stats, spells, gear and dice.",
    tone: "border-amber-700/70 bg-amber-950/20 hover:bg-amber-950/40"
  }), /*#__PURE__*/React.createElement(Opt, {
    mode: "gm",
    title: "Game Master",
    sub: "Initiative and combat tracker with enemy stat blocks.",
    tone: "border-sky-700/70 bg-sky-950/20 hover:bg-sky-950/40"
  })));
}
function Root() {
  const [mode, setMode] = useState(loadMode);
  useEffect(() => {
    try {
      if (mode) localStorage.setItem(HUB_KEY, JSON.stringify({
        mode
      }));
    } catch (e) {/* storage blocked */}
  }, [mode]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);
  if (!mode) return /*#__PURE__*/React.createElement(ModePicker, {
    onPick: setMode
  });
  return mode === "player" ? /*#__PURE__*/React.createElement(SheetApp, {
    onSwitch: () => setMode("gm")
  }) : /*#__PURE__*/React.createElement(LiteApp, {
    onSwitch: () => setMode("player"),
    getSheetChars: readSheetChars
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(Root, null));