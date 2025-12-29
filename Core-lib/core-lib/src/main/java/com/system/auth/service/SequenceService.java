package com.system.auth.service;

import com.system.auth.mapper.SequenceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SequenceService {
    private final SequenceMapper sequenceMapper;

    public int selectTokenSequence(){
        return sequenceMapper.SELECT_NEXT_TOKEN_ID();
    }
}
